import type { DB } from '../db';
import type { PaymentGateway } from './payment.gateway';

export interface SportEvent {
  id: string;
  name: string;
  capacity: number;
  registered: number;
}

export class EventNotFoundError extends Error {
  constructor(id: string) {
    super(`Event not found: ${id}`);
  }
}

export class EventFullError extends Error {
  constructor(id: string) {
    super(`Event is full: ${id}`);
  }
}

export class PaymentFailedError extends Error {
  constructor(reason: string) {
    super(`Payment failed: ${reason}`);
  }
}

export class EventsService {
  constructor(private db: DB, private payment: PaymentGateway) {}

  list(): SportEvent[] {
    return this.db.prepare('SELECT * FROM events ORDER BY name').all() as SportEvent[];
  }

  get(id: string): SportEvent {
    const row = this.db.prepare('SELECT * FROM events WHERE id = ?').get(id) as SportEvent | undefined;
    if (!row) throw new EventNotFoundError(id);
    return row;
  }

  async registerParticipant(eventId: string, email: string, amountCents: number): Promise<{ transactionId: string }> {
    const event = this.get(eventId);
    if (event.registered >= event.capacity) {
      throw new EventFullError(eventId);
    }
    const result = await this.payment.charge(email, amountCents);
    if (!result.success || !result.transactionId) {
      throw new PaymentFailedError(result.error ?? 'unknown');
    }
    const tx = this.db.transaction(() => {
      this.db.prepare('UPDATE events SET registered = registered + 1 WHERE id = ?').run(eventId);
      this.db.prepare('INSERT INTO participants (event_id, email, paid) VALUES (?, ?, 1)').run(eventId, email);
    });
    tx();
    return { transactionId: result.transactionId };
  }
}
