import { createDb, seed } from '../../src/db';
import { EventsService, EventFullError, EventNotFoundError, PaymentFailedError } from '../../src/services/events.service';
import type { PaymentGateway } from '../../src/services/payment.gateway';

// ════════════════════════════════════════════════════════════════
// 🎯 TP1 — Tests unitaires Jest + TypeScript
// ════════════════════════════════════════════════════════════════
// Énoncé complet : exercices/tp1-tests-unitaires.md
//
// Vous allez compléter 5 tests `it.todo` répartis en 3 parties :
//   Partie A — get() : 1 test (matcher d'erreur)
//   Partie B — registerParticipant() happy path : 2 tests (mock + assertions)
//   Partie C — registerParticipant() chemins d'erreur : 2 tests (paiement KO)
//
// Lancer : npm run test:unit
// Référence : tests/unit/validation.test.ts (exemple complet bien écrit)

function setup(payment: PaymentGateway) {
  const db = createDb();
  seed(db);
  return new EventsService(db, payment);
}

describe('EventsService', () => {

  // ──────────────────────────────────────────────────
  // Partie A — Lecture (get)
  // ──────────────────────────────────────────────────
  describe('get()', () => {
    it('returns an existing event', () => {
      const service = setup({ charge: jest.fn() });
      const event = service.get('marathon-paris');
      expect(event.name).toBe('Marathon de Paris');
      expect(event.capacity).toBe(100);
    });

    // 🎯 TP1 - A.1
    // Écrire un test qui vérifie que get() lève EventNotFoundError
    // quand l'id n'existe pas. Indice : utiliser expect(() => ...).toThrow(...)
    it.todo('throws EventNotFoundError for an unknown id');
  });

  // ──────────────────────────────────────────────────
  // Partie B — Inscription : happy path
  // ──────────────────────────────────────────────────
  describe('registerParticipant() — happy path', () => {

    // 🎯 TP1 - B.1
    // Écrire un test qui vérifie que :
    //   - charge a été appelée avec ('alice@example.com', 5000)
    //   - le résultat retourné contient transactionId === 'tx_123'
    // Indice : jest.fn().mockResolvedValue({ success: true, transactionId: 'tx_123' })
    it.todo('charges the payment gateway with email and amount');

    // 🎯 TP1 - B.2
    // Écrire un test qui vérifie que le compteur "registered" passe de 0 à 1
    // sur l'événement marathon-paris après une inscription réussie.
    it.todo('increments the registered count after a successful registration');
  });

  // ──────────────────────────────────────────────────
  // Partie C — Inscription : chemins d'erreur
  // ──────────────────────────────────────────────────
  describe('registerParticipant() — error paths', () => {
    it('throws EventFullError when capacity is reached', async () => {
      const charge = jest.fn();
      const service = setup({ charge });

      await expect(
        service.registerParticipant('trail-chamonix', 'bob@example.com', 5000)
      ).rejects.toThrow(EventFullError);

      // Vérifier que le paiement n'a PAS été tenté
      expect(charge).not.toHaveBeenCalled();
    });

    // 🎯 TP1 - C.1
    // Écrire un test qui vérifie que :
    //   - quand la passerelle retourne { success: false, error: 'card_declined' }
    //   - registerParticipant rejette avec PaymentFailedError
    // Indice : await expect(...).rejects.toThrow(PaymentFailedError)
    it.todo('throws PaymentFailedError when the gateway returns success=false');

    // 🎯 TP1 - C.2
    // Écrire un test qui vérifie que le compteur "registered" n'a PAS bougé
    // après un échec de paiement (rollback de l'effet de bord).
    it.todo('does not increment registered count when payment fails');
  });
});
