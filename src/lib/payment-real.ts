export interface PaymentRequest {
  orderId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
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
  status: 'pending' | 'success' | 'failed';
  method: 'card' | 'bank_transfer' | 'qris';
}

export async function createPaymentTransaction(
  request: PaymentRequest,
  method: 'card' | 'bank_transfer' | 'qris' = 'qris'
): Promise<PaymentResponse> {
  const paymentApiKey = process.env.PAYMENT_API_KEY;

  if (!paymentApiKey) {
    throw new Error('PAYMENT_API_KEY not configured');
  }

  try {
    const payload = {
      order_id: request.orderId,
      amount: request.amount,
      customer_email: request.customerEmail,
      customer_name: request.customerName,
      payment_method: method,
      items: request.items,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/payment`,
    };

    const response = await fetch('https://api.payment.co.id/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paymentApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Payment API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();

    return {
      transactionId: data.transaction_id || data.id,
      paymentUrl: data.payment_url,
      qrisUrl: data.qris_url || data.qr_code_url,
      status: 'pending',
      method: method,
    };
  } catch (error) {
    console.error('Payment creation error:', error);
    throw error;
  }
}

export async function getQrisCode(orderId: string): Promise<string | null> {
  const qrislyApiKey = process.env.QRISLY_API_KEY;

  if (!qrislyApiKey) {
    console.warn('QRISLY_API_KEY not configured');
    return null;
  }

  try {
    const response = await fetch('https://api.qrisly.co.id/qris/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${qrislyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_id: orderId,
        amount: 0, // Amount will be added dynamically
        merchant_name: 'De Ritz',
        merchant_city: 'Surabaya',
      }),
    });

    if (!response.ok) {
      console.error('QRIS generation error:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.qr_string || data.qris_string || null;
  } catch (error) {
    console.error('QRIS API error:', error);
    return null;
  }
}

export async function verifyPaymentStatus(transactionId: string): Promise<{
  status: 'pending' | 'success' | 'failed';
  amount: number;
}> {
  const paymentApiKey = process.env.PAYMENT_API_KEY;

  if (!paymentApiKey) {
    throw new Error('PAYMENT_API_KEY not configured');
  }

  try {
    const response = await fetch(
      `https://api.payment.co.id/transactions/${transactionId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${paymentApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      status: data.status || 'pending',
      amount: data.amount || 0,
    };
  } catch (error) {
    console.error('Payment status check error:', error);
    throw error;
  }
}
