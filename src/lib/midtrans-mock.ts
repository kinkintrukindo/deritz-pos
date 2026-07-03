export interface MockPaymentParams {
  orderId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  items: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export interface MockPaymentToken {
  token: string;
  orderId: string;
  amount: number;
  items: MockPaymentParams['items'];
  customer: {
    name: string;
    email: string;
  };
}

export async function createMockPaymentToken(params: MockPaymentParams): Promise<MockPaymentToken> {
  // Generate a mock token for demo payments (no external dependencies)
  const mockToken = {
    token: `MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    orderId: params.orderId,
    amount: params.amount,
    items: params.items,
    customer: {
      name: params.customerName,
      email: params.customerEmail,
    },
  };

  return mockToken;
}
