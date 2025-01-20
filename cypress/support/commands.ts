// Custom command for authentication
Cypress.Commands.add('login', () => {
  // This is a simplified example. In practice, you'd want to:
  // 1. Either mock Supabase auth
  // 2. Or use a test account with actual credentials
  cy.window().then((win) => {
    win.localStorage.setItem('supabase.auth.token', 'test-token');
  });
});