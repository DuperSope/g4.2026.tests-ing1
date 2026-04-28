import request from 'supertest';
import { createApp } from '../../src/app';
import { createDb, seed } from '../../src/db';
import type { PaymentGateway } from '../../src/services/payment.gateway';

function makeApp(payment: PaymentGateway) {
  const db = createDb();
  seed(db);
  return createApp(db, payment);
}

const okPayment: PaymentGateway = {
  charge: async () => ({ success: true, transactionId: 'tx_int' }),
};

describe('GET /api/events', () => {
  it('returns the list of events', async () => {
    const app = makeApp(okPayment);
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });
});

describe('POST /api/events/:id/register', () => {
  it('registers a participant on a free event', async () => {
    const app = makeApp(okPayment);
    const res = await request(app)
      .post('/api/events/marathon-paris/register')
      .send({ email: 'alice@example.com', amountCents: 5000 });
    expect(res.status).toBe(201);
    expect(res.body.transactionId).toBe('tx_int');
  });

  // ════════════════════════════════════════════════════════════════
  // 🎯 EXERCICE 3 — Tests d'intégration Supertest
  // ════════════════════════════════════════════════════════════════
  // Compléter les deux tests ci-dessous :
  //   1. Inscription sur un événement inexistant → 404 { error: 'event_not_found' }
  //   2. Inscription sur un événement complet (trail-chamonix) → 409 { error: 'event_full' }
  // Indices :
  // - Réutiliser le helper makeApp(okPayment)
  // - Utiliser request(app).post(...).send(...).expect(...) ou .then()

  it.todo('returns 404 when the event does not exist');

  it.todo('returns 409 when the event is full');
});
