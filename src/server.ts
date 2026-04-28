import { createApp } from './app';
import { createDb, seed } from './db';
import { PaymentGateway, PaymentResult } from './services/payment.gateway';

class FakeDevPaymentGateway implements PaymentGateway {
  async charge(_email: string, _amountCents: number): Promise<PaymentResult> {
    return { success: true, transactionId: `dev_${Date.now()}` };
  }
}

const db = createDb();
seed(db);
const app = createApp(db, new FakeDevPaymentGateway());

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`sport-events-ts listening on http://localhost:${port}`);
});
