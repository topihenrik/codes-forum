describe('app core functionality', () => {
  it('visit front page', () => {
    cy.visit("http://localhost:4173/");
    cy.contains("Any problem can be solved with DebugIt!")
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
    cy.contains("Any problem can be solved with DebugIt!");
    cy.get('#link-account-desktop').click();
    cy.contains('@pertsa82');
  });
  it('create a new post and view it', () => {
    cy.visit("http://localhost:4173/");
    cy.get("#link-login-desktop").click();
    cy.get('#input-username').type('pertsa82');
    cy.get('#input-password').clear().type('jes123');
    cy.get('#btn-login').click();
    cy.contains("Any problem can be solved with DebugIt!");
    cy.contains('Ask Question').click();
    cy.get('#input-title').type("I need help with a problem!");
    cy.get('.draftjs-editor.rdw-editor-main').type("My test file contains 5 tests. Is that possible to run a specific test rather than all the tests in the file?");
    cy.contains('Submit').click();
    cy.contains("Any problem can be solved with DebugIt!");
    cy.contains('I need help with a problem!').click();
    cy.contains('I need help with a problem!');
    cy.contains('My test file contains 5 tests. Is that possible to run a specific test rather than all the tests in the file?');
  })
});
