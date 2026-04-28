describe('Inscription à un événement', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('ouvre la modale d\'inscription au clic', () => {
    cy.get('[data-testid=register-marathon-paris]').click();
    cy.get('[data-testid=register-dialog]').should('be.visible');
    cy.get('[data-testid=dialog-title]').should('contain', 'Inscription');
  });

  // ════════════════════════════════════════════════════════════════
  // 🎯 EXERCICE 4 — Tests E2E Cypress
  // ════════════════════════════════════════════════════════════════
  // Compléter le scénario complet d'inscription :
  //   1. Cliquer sur le bouton d'inscription du marathon-paris
  //   2. Saisir un email valide dans [data-testid=email-input]
  //   3. Soumettre via [data-testid=submit-btn]
  //   4. Vérifier qu'un message de succès s'affiche [data-testid=success-message]
  //   5. (Bonus) Vérifier que le compteur d'inscrits a augmenté
  //
  // Indices :
  // - cy.get('[data-testid=...]').click()
  // - cy.get('...').type('alice@example.com')
  // - cy.get('...').should('contain', 'confirmée')

  it('inscrit un participant et affiche un message de succès');
});
