declare module 'midtrans-client' {
  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: string | undefined;
      clientKey: string | undefined;
    });
    createTransactionToken(parameter: unknown): Promise<string>;
    transaction: {
      status(orderId: string): Promise<unknown>;
    };
  }
}
