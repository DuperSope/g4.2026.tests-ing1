describe('Homepage', () => {
  it('displays the title and the list of events', () => {
    cy.visit('/');
    cy.get('[data-testid=page-title]').should('contain', 'Événements sportifs');
    cy.get('[data-testid=events-list]').children().should('have.length.at.least', 3);
  });

  it('disables the register button on a full event', () => {
    cy.visit('/');
    cy.get('[data-testid=register-trail-chamonix]').should('be.disabled');
  });
});
