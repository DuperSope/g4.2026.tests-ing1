// Test de référence — montre la structure AAA et les matchers Jest courants.
// À utiliser comme exemple avant l'exercice 2.

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function computeFee(baseCents: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('discount must be 0..100');
  }
  return Math.round(baseCents * (1 - discountPercent / 100));
}

describe('isValidEmail', () => {
  it('accepts a standard email', () => {
    expect(isValidEmail('alice@example.com')).toBe(true);
  });

  it('rejects missing @', () => {
    expect(isValidEmail('alice.example.com')).toBe(false);
  });

  it.each([
    ['', false],
    ['a@b.c', true],
    ['no-at-sign', false],
  ])('isValidEmail(%p) → %p', (input, expected) => {
    expect(isValidEmail(input)).toBe(expected);
  });
});

describe('computeFee', () => {
  it('applies a 20% discount', () => {
    expect(computeFee(5000, 20)).toBe(4000);
  });

  it('throws when discount is out of range', () => {
    expect(() => computeFee(5000, 150)).toThrow('discount must be 0..100');
  });
});
