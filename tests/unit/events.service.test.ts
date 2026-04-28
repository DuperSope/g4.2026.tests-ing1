import { createDb } from '../../src/db';
import {
  EventFullError,
  EventsService
} from '../../src/services/events.service';
import { seedEvent } from '../fixtures/events';

// ════════════════════════════════════════════════════════════════
// 🎯 TP1 — Tests unitaires Jest + TypeScript
// ════════════════════════════════════════════════════════════════
// Énoncé complet : exercices/tp1-tests-unitaires.md
//
// Ce fichier illustre 3 patterns vus en cours :
//   - beforeEach() pour repartir d'un état frais à chaque test
//   - Factory makeEvent() / seedEvent() pour construire des données de test
//   - Pattern AAA (Arrange / Act / Assert) commenté explicitement
//
// Lancer : npm run test:unit
// Référence : tests/unit/validation.test.ts (matchers de base)

describe('EventsService', () => {
  let db: ReturnType<typeof createDb>;
  let charge: jest.Mock;
  let service: EventsService;

  beforeEach(() => {
    // Arrange (commun) : DB fraîche et mock vierge avant CHAQUE test
    db = createDb();
    charge = jest.fn();
    service = new EventsService(db, { charge });
  });

  // ──────────────────────────────────────────────────
  // Partie A — Lecture (get)
  // ──────────────────────────────────────────────────
  describe('get()', () => {
    it('returns an existing event', () => {
      // Arrange
      const seeded = seedEvent(db, { name: 'Marathon de Paris', capacity: 100 });

      // Act
      const event = service.get(seeded.id);

      // Assert
      expect(event.name).toBe('Marathon de Paris');
      expect(event.capacity).toBe(100);
    });

    // 🎯 TP1 - A.1
    // Vérifier que get() lève EventNotFoundError quand l'id n'existe pas.
    // Indice : expect(() => ...).toThrow(EventNotFoundError)
    it.todo('throws EventNotFoundError for an unknown id');
  });

  // ──────────────────────────────────────────────────
  // Partie B — Inscription : happy path
  // ──────────────────────────────────────────────────
  describe('registerParticipant() — happy path', () => {
    // 🎯 TP1 - B.1
    // Vérifier que charge a été appelée avec ('alice@example.com', 5000)
    // et que le résultat retourné contient transactionId === 'tx_123'.
    // Indice : charge.mockResolvedValue({ success: true, transactionId: 'tx_123' })
    it.todo('charges the payment gateway with email and amount');

    // 🎯 TP1 - B.2
    // Vérifier que le compteur "registered" passe de 0 à 1 après une
    // inscription réussie. Pattern : capturer l'état AVANT, agir, vérifier l'état APRÈS.
    it.todo('increments the registered count after a successful registration');
  });

  // ──────────────────────────────────────────────────
  // Partie C — Inscription : chemins d'erreur
  // ──────────────────────────────────────────────────
  describe('registerParticipant() — error paths', () => {
    it('throws EventFullError when capacity is reached', async () => {
      // Arrange : événement seedé déjà complet
      const fullEvent = seedEvent(db, { capacity: 2, registered: 2 });

      // Act + Assert
      await expect(
        service.registerParticipant(fullEvent.id, 'bob@example.com', 5000)
      ).rejects.toThrow(EventFullError);

      // Le paiement ne doit PAS avoir été tenté
      expect(charge).not.toHaveBeenCalled();
    });

    // 🎯 TP1 - C.1
    // Vérifier que registerParticipant rejette avec PaymentFailedError
    // quand la passerelle retourne { success: false, error: 'card_declined' }.
    // ⚠️ Ne pas oublier le `await` devant expect(...).rejects.toThrow(...) !
    it.todo('throws PaymentFailedError when the gateway returns success=false');

    // 🎯 TP1 - C.2
    // Vérifier que le compteur "registered" n'a PAS bougé après un échec
    // de paiement. C'est le test qui distingue un bon test d'un test naïf.
    it.todo('does not increment registered count when payment fails');
  });
});
