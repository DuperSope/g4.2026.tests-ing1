import { sendEmail } from './mailer';

export class EmailSender {
  private sentCount = 0;

  async sendRegistrationConfirmation(email: string, eventName: string): Promise<string> {
    const result = await sendEmail(
      email,
      `Inscription confirmée : ${eventName}`,
      `Bonjour,\n\nMerci pour votre inscription à ${eventName}.\n\nÀ bientôt !`
    );
    this.sentCount += 1;
    return result.id;
  }

  getSentCount(): number {
    return this.sentCount;
  }
}
