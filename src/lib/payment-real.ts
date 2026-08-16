export type BankTransferBank = 'bni' | 'bri' | 'permata' | 'cimb' | 'bsi' | 'mandiri';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  bankCode?: BankTransferBank;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface PaymentResponse {
  transactionId: string;
  paymentUrl?: string;
  qrisUrl?: string;
  vaNumber?: string;
  vaBank?: string;
  // Mandiri Bill Payment returns these instead of a va_number
  billKey?: string;
  billerCode?: string;
  status: 'pending' | 'success' | 'failed';
  method: 'card' | 'bank_transfer' | 'qris';
}

// Midtrans server keys are prefixed "SB-Mid-server-" for sandbox and
// "Mid-server-" for production. We detect the environment from the key
// itself so this works correctly in both without needing a separate
// env var to keep in sync.
function isProductionKey(serverKey: string): boolean {
  return !serverKey.startsWith('SB-');
}

function getMidtransConfig() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    throw new Error('MIDTRANS_SERVER_KEY not configured');
  }
  const production = isProductionKey(serverKey);
  return {
    serverKey,
    coreApiBase: production ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com',
    snapApiBase: production ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com',
  };
}

function authHeader(serverKey: string): string {
  return 'Basic ' + Buffer.from(`${serverKey}:`).toString('base64');
}

function toItemDetails(items: PaymentRequest['items']) {
  return items.map((item) => ({
    id: item.id,
    price: item.price,
    quantity: item.quantity,
    name: item.name.slice(0, 50), // Midtrans limits item name length
  }));
}

function splitName(fullName: string): { first_name: string; last_name?: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { first_name: parts[0] };
  return { first_name: parts[0], last_name: parts.slice(1).join(' ') };
}

async function createSnapTransaction(
  request: PaymentRequest,
  enabledPayments: string[],
  method: 'card' | 'bank_transfer' | 'qris'
): Promise<PaymentResponse> {
  const { serverKey, snapApiBase } = getMidtransConfig();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.de-ritz.com';

  const response = await fetch(`${snapApiBase}/snap/v1/transactions`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(serverKey),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: request.orderId,
        gross_amount: request.amount,
      },
      item_details: toItemDetails(request.items),
      customer_details: {
        ...splitName(request.customerName),
        email: request.customerEmail,
        phone: request.customerPhone,
      },
      enabled_payments: enabledPayments,
      callbacks: {
        finish: `${appUrl}/order-confirmation/${request.orderId}`,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data.status_message || data.error_messages?.join(', ') || response.statusText;
    throw new Error(`Midtrans Snap error: ${message}`);
  }

  return {
    transactionId: request.orderId,
    paymentUrl: data.redirect_url,
    status: 'pending',
    method,
  };
}

// Maps our internal bank codes to the Snap enabled_payments values Midtrans
// expects for each Virtual Account channel.
const BANK_TO_SNAP_PAYMENT: Record<BankTransferBank, string> = {
  bni: 'bni_va',
  bri: 'bri_va',
  permata: 'permata_va',
  cimb: 'cimb_va',
  bsi: 'bsi_va',
  mandiri: 'echannel',
};

async function createQrisTransaction(request: PaymentRequest): Promise<PaymentResponse> {
  return createSnapTransaction(request, ['gopay'], 'qris');
}

async function createBankTransferTransaction(request: PaymentRequest): Promise<PaymentResponse> {
  const bank = request.bankCode || 'bni';
  const snapPayment = BANK_TO_SNAP_PAYMENT[bank];
  return createSnapTransaction(request, [snapPayment], 'bank_transfer');
}

async function createCardTransaction(request: PaymentRequest): Promise<PaymentResponse> {
  return createSnapTransaction(request, ['credit_card'], 'card');
}

export async function createPaymentTransaction(
  request: PaymentRequest,
  method: 'card' | 'bank_transfer' | 'qris' = 'qris'
): Promise<PaymentResponse> {
  try {
    if (method === 'qris') return await createQrisTransaction(request);
    if (method === 'bank_transfer') return await createBankTransferTransaction(request);
    return await createCardTransaction(request);
  } catch (error) {
    console.error('Payment creation error:', error);
    throw error;
  }
}

export async function verifyPaymentStatus(orderId: string): Promise<{
  status: 'pending' | 'success' | 'failed';
  amount: number;
}> {
  const { serverKey, coreApiBase } = getMidtransConfig();

  const response = await fetch(`${coreApiBase}/v2/${orderId}/status`, {
    method: 'GET',
    headers: {
      Authorization: authHeader(serverKey),
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Status check failed: ${response.statusText}`);
  }

  const data = await response.json();
  const transactionStatus = data.transaction_status as string;

  const status: 'pending' | 'success' | 'failed' =
    transactionStatus === 'settlement' || transactionStatus === 'capture'
      ? 'success'
      : transactionStatus === 'pending'
      ? 'pending'
      : 'failed';

  return {
    status,
    amount: Number(data.gross_amount) || 0,
  };
}
