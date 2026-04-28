import express, { Express } from 'express';
import path from 'path';
import { eventsRouter } from './routes/events';
import { EventsService } from './services/events.service';
import type { DB } from './db';
import type { PaymentGateway } from './services/payment.gateway';

export function createApp(db: DB, payment: PaymentGateway): Express {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  const service = new EventsService(db, payment);
  app.use('/api', eventsRouter(service));

  return app;
}
