describe('Booking Flow', () => {
  beforeEach(() => {
    // Assuming we have a test user
    cy.login(); // Custom command to handle authentication
  });

  it('allows users to search for cleaners', () => {
    cy.visit('/search');
    cy.get('input[placeholder*="Search"]').type('Test Cleaner');
    cy.get('select').select('House Cleaning');
    
    cy.contains('Test Cleaner').should('be.visible');
  });

  it('completes booking process', () => {
    cy.visit('/search');
    cy.contains('Book Now').first().click();
    
    // Fill booking form
    cy.get('input[name="service_date"]').type('2024-12-31T10:00');
    cy.get('input[name="duration_hours"]').type('2');
    cy.get('select[name="service_type"]').select('House Cleaning');
    cy.get('input[name="address"]').type('123 Test St');
    
    cy.contains('Book Now').click();
    cy.contains('Booking created successfully').should('be.visible');
  });
});