export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentGateway {
  charge(email: string, amountCents: number): Promise<PaymentResult>;
}

export class StripePaymentGateway implements PaymentGateway {
  async charge(email: string, amountCents: number): Promise<PaymentResult> {
    throw new Error('Real payment gateway not configured in tests');
  }
}
