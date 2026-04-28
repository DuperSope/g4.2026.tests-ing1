import { Router } from 'express';
import { EventsService, EventNotFoundError, EventFullError, PaymentFailedError } from '../services/events.service';

export function eventsRouter(service: EventsService): Router {
  const router = Router();

  router.get('/events', (_req, res) => {
    res.json(service.list());
  });

  router.get('/events/:id', (req, res) => {
    try {
      res.json(service.get(req.params.id));
    } catch (err) {
      if (err instanceof EventNotFoundError) return res.status(404).json({ error: 'event_not_found' });
      throw err;
    }
  });

  router.post('/events/:id/register', async (req, res) => {
    const { email, amountCents } = req.body ?? {};
    if (!email || typeof amountCents !== 'number') {
      return res.status(400).json({ error: 'invalid_payload' });
    }
    try {
      const result = await service.registerParticipant(req.params.id, email, amountCents);
      return res.status(201).json(result);
    } catch (err) {
      if (err instanceof EventNotFoundError) return res.status(404).json({ error: 'event_not_found' });
      if (err instanceof EventFullError) return res.status(409).json({ error: 'event_full' });
      if (err instanceof PaymentFailedError) return res.status(402).json({ error: 'payment_failed' });
      throw err;
    }
  });

  return router;
}
