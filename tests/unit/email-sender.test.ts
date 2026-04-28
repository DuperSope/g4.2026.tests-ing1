// Exemple de référence — DÉMONSTRATION, pas un exercice.
//
// Ce fichier illustre 3 techniques de mocking vues en cours :
//   1. jest.mock('module')        → remplace tout un module par un mock
//   2. jest.mocked<T>(fn)         → helper TS pour le typage du mock
//   3. jest.spyOn(obj, 'method')  → observer/wrapper une méthode existante

import { EmailSender } from '../../src/services/email-sender';
import * as mailer from '../../src/services/mailer';

// (1) On mocke TOUT le module './mailer' : sendEmail devient une jest.fn() automatiquement.
jest.mock('../../src/services/mailer');

// (2) jest.mocked() : helper TS qui donne le bon type au mock (autocomplétion sur mockResolvedValue, etc.).
const mockedSendEmail = jest.mocked(mailer.sendEmail);

describe('EmailSender — jest.mock() sur un module', () => {
  beforeEach(() => {
    // Reset entre chaque test pour ne pas hériter des mocks/calls précédents.
    mockedSendEmail.mockReset();
    mockedSendEmail.mockResolvedValue({ id: 'msg_123', acceptedAt: new Date('2026-01-01') });
  });

  it('envoie un email de confirmation avec le bon sujet', async () => {
    // Arrange
    const sender = new EmailSender();

    // Act
    const messageId = await sender.sendRegistrationConfirmation(
      'alice@example.com',
      'Marathon de Paris'
    );

    // Assert
    expect(mockedSendEmail).toHaveBeenCalledTimes(1);
    expect(mockedSendEmail).toHaveBeenCalledWith(
      'alice@example.com',
      'Inscription confirmée : Marathon de Paris',
      expect.stringContaining('Merci pour votre inscription')
    );
    expect(messageId).toBe('msg_123');
  });

  it('propage les erreurs de la passerelle mail', async () => {
    // mockRejectedValueOnce : rejette UNE fois, puis revient au comportement précédent.
    mockedSendEmail.mockRejectedValueOnce(new Error('SMTP timeout'));
    const sender = new EmailSender();

    await expect(
      sender.sendRegistrationConfirmation('bob@example.com', 'Trail')
    ).rejects.toThrow('SMTP timeout');
  });
});

describe('EmailSender — jest.spyOn() sur une instance', () => {
  it('observe les appels à une méthode sans changer son comportement', async () => {
    // Arrange
    mockedSendEmail.mockResolvedValue({ id: 'msg_xyz', acceptedAt: new Date() });
    const sender = new EmailSender();

    // (3) spy = wrapper autour de la vraie méthode. Le code original tourne, on observe les appels.
    const spy = jest.spyOn(sender, 'sendRegistrationConfirmation');

    // Act
    await sender.sendRegistrationConfirmation('alice@example.com', 'Semi de Lyon');

    // Assert : on peut inspecter le spy comme un mock classique
    expect(spy).toHaveBeenCalledWith('alice@example.com', 'Semi de Lyon');
    expect(sender.getSentCount()).toBe(1); // ← preuve que la vraie méthode a tourné

    spy.mockRestore(); // bonne pratique : restaurer la méthode originale
  });

  it('peut aussi remplacer le retour avec mockReturnValue', async () => {
    const sender = new EmailSender();
    const spy = jest
      .spyOn(sender, 'sendRegistrationConfirmation')
      .mockResolvedValue('fake-id');

    const result = await sender.sendRegistrationConfirmation('a@b.c', 'Whatever');

    expect(result).toBe('fake-id');
    expect(sender.getSentCount()).toBe(0); // ← la vraie méthode N'a PAS tourné
    spy.mockRestore();
  });
});
