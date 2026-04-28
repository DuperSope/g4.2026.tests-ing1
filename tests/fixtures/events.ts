// Factories et fixtures pour les tests.
// Pattern : une fonction qui produit une donnée par défaut, surchargeable.

import type { DB } from '../../src/db';
import type { SportEvent } from '../../src/services/events.service';

let counter = 0;

/**
 * Factory : crée un SportEvent avec des valeurs par défaut.
 * Surcharger ce dont on a besoin pour le test.
 *
 * @example
 *   makeEvent({ capacity: 1, registered: 1 }) // → événement complet
 */
export function makeEvent(overrides: Partial<SportEvent> = {}): SportEvent {
  counter += 1;
  return {
    id: `event-${counter}`,
    name: `Test Event ${counter}`,
    capacity: 100,
    registered: 0,
    ...overrides,
  };
}

/**
 * Insère un événement dans la DB (seed ciblé pour un test).
 */
export function seedEvent(db: DB, overrides: Partial<SportEvent> = {}): SportEvent {
  const event = makeEvent(overrides);
  db.prepare(
    'INSERT INTO events (id, name, capacity, registered) VALUES (?, ?, ?, ?)'
  ).run(event.id, event.name, event.capacity, event.registered);
  return event;
}
