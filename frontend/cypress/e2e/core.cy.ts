describe('app core functionality', () => {
  it('visit front page', () => {
    cy.visit("http://localhost:4173/");
    cy.contains("Home Page")
  });
  it('sign up, login and go to account page', () => {
    cy.visit("http://localhost:4173/");
    cy.get("#link-signup-desktop").click();
    cy.contains('Create account');
    cy.get('#input-username').type("pertsa82");
    cy.get('#input-password').type("jes123");
    cy.get('#input-confirm-password').type("kes123");
    cy.get('#btn-signup').click();
    cy.contains("passwords don't match");
    cy.get('#input-confirm-password').clear().type("jes123");
    cy.get('#btn-signup').click();
    cy.contains('Account Login');
    cy.get('#input-username').type('pertsa82');
    cy.get('#input-password').type('xif123');
    cy.get('#btn-login').click();
    cy.contains('incorrect credentials');
    cy.get('#input-password').clear().type('jes123');
    cy.get('#btn-login').click();
    cy.contains("Home Page");
    cy.get('#link-account-desktop').click();
    cy.contains('@pertsa82');
  })
});
