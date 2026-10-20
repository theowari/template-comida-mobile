import type { Order } from '../types';

export type PaymentOutcome =
  | { status: 'not-charged'; message: string }
  | { status: 'pending'; pixCopyPaste?: string; expiresAt?: string }
  | { status: 'paid' }
  | { status: 'failed'; message: string };

/**
 * Contract for a payment provider (Pix and online card). Implement it with
 * the provider's SDK on the backend; the front end should only receive the
 * Pix code or a redirect, never raw card data.
 */
export interface PaymentProvider {
  readonly isDemo: boolean;
  startPayment(order: Order): Promise<PaymentOutcome>;
}

/** DEMO: never charges anything. Card and cash are paid on delivery or pickup. */
const demoPaymentProvider: PaymentProvider = {
  isDemo: true,
  async startPayment() {
    return {
      status: 'not-charged',
      message: 'Demonstração: nenhuma cobrança foi feita.',
    };
  },
};

export const paymentProvider: PaymentProvider = demoPaymentProvider;
