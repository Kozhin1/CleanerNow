describe('Authentication', () => {
  it('allows users to sign in', () => {
    cy.visit('/');
    cy.contains('Sign In').click();
    
    // Auth modal should appear
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('shows validation errors for invalid credentials', () => {
    cy.visit('/');
    cy.contains('Sign In').click();
    
    cy.get('input[type="email"]').type('invalid@email');
    cy.get('input[type="password"]').type('short');
    cy.contains('Sign In').click();
    
    cy.contains('Invalid email format').should('be.visible');
  });
});