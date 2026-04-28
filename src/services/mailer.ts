// Wrapper d'une dépendance externe (en vrai : SendGrid, SES, Postmark...).
// On l'isole dans son propre module pour pouvoir le mocker via jest.mock().

export interface MailResult {
  id: string;
  acceptedAt: Date;
}

export async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<MailResult> {
  // Implémentation réelle : appel HTTP au provider.
  // Volontairement non implémentée — sera mockée en test.
  throw new Error('Real mailer not configured. Mock me in tests.');
}
