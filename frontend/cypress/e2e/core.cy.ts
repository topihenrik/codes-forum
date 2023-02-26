describe('app core functionality', () => {
  it('visit front page', () => {
    cy.visit("http://localhost:4173/");
    cy.contains("Just DebugIt!")
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
    cy.contains("Just DebugIt!");
    cy.get('#link-account-desktop').click();
    cy.contains('@pertsa82');
  });
  it('create a new post and view it', () => {
    cy.visit("http://localhost:4173/");
    cy.get("#link-login-desktop").click();
    cy.get('#input-username').type('pertsa82');
    cy.get('#input-password').type('jes123');
    cy.get('#btn-login').click();
    cy.contains("Just DebugIt!");
    cy.contains('Ask Question').click();
    cy.get('#input-title').type("I need help with a problem!");
    cy.get('.draftjs-editor.rdw-editor-main').type("My test file contains 5 tests. Is that possible to run a specific test rather than all the tests in the file?");
    cy.contains('Submit').click();
    cy.contains('I need help with a problem!');
    cy.contains('Edit');
    cy.contains('Delete');
    cy.contains("Asked");
    cy.contains('My test file contains 5 tests. Is that possible to run a specific test rather than all the tests in the file?');
  });
  it('create a comment to a post and view it', () => {
    cy.visit("http://localhost:4173/");
    cy.get("#link-login-desktop").click();
    cy.get('#input-username').type('pertsa82');
    cy.get('#input-password').type('jes123');
    cy.get('#btn-login').click();
    cy.contains("Just DebugIt!");
    cy.contains('I need help with a problem!').click();
    cy.contains('I need help with a problem!');
    cy.contains('My test file contains 5 tests. Is that possible to run a specific test rather than all the tests in the file?');
    cy.get('.draftjs-editor.rdw-editor-main').type("To solve the problem you need to restart the computer.");
    cy.contains('Submit').click();
    cy.reload();
    cy.get(".comment").contains("To solve the problem you need to restart the computer.");
  });
  it('edit a post and view it', () => {
    cy.visit("http://localhost:4173/");
    cy.get("#link-login-desktop").click();
    cy.get('#input-username').type('pertsa82');
    cy.get('#input-password').type('jes123');
    cy.get('#btn-login').click();
    cy.contains("Just DebugIt!");
    cy.contains('I need help with a problem!').click();
    cy.contains('I need help with a problem!');
    cy.contains('My test file contains 5 tests. Is that possible to run a specific test rather than all the tests in the file?');
    cy.get("#link-edit-post").click();
    cy.get('#input-title').type("?!");
    cy.get('.draftjs-editor.rdw-editor-main').type('{moveToEnd}').type("!?");
    cy.contains('Update').click();
    cy.contains('I need help with a problem!?!');
    cy.contains('Edit');
    cy.contains('Delete');
    cy.contains("Asked");
    cy.contains('My test file contains 5 tests. Is that possible to run a specific test rather than all the tests in the file?!?');
  });
  it('edit a comment and view it', () => {
    cy.visit("http://localhost:4173/");
    cy.get("#link-login-desktop").click();
    cy.get('#input-username').type('pertsa82');
    cy.get('#input-password').type('jes123');
    cy.get('#btn-login').click();
    cy.contains("Just DebugIt!");
    cy.contains('I need help with a problem!?!').click();
    cy.contains('I need help with a problem!?!');
    cy.contains('My test file contains 5 tests. Is that possible to run a specific test rather than all the tests in the file?!?');
    cy.get('.comment-full').within(() => cy.contains('Edit').click());
    cy.get('.comment-edit').within(() => {
      cy.get('.draftjs-editor.rdw-editor-main').type('{moveToEnd}').type("..");
      cy.contains('Update').click();
    });
    cy.get('.comment-full').within(() => {
      cy.contains("To solve the problem you need to restart the computer...");
      cy.contains('Edit');
      cy.contains('Delete');
      cy.contains('Answered');
      cy.contains('Modified');
    });
  });
  it('users profile page can be viewed', () => {
    cy.visit("http://localhost:4173/");
    cy.contains("Just DebugIt!");
    cy.contains("@pertsa82").click();
    cy.contains("Profile");
    cy.contains("@pertsa82");
    cy.contains("Posts: 1");
    cy.contains("Comments: 1");
    cy.contains("Account Age: 0 days");
  });
  it("user can change their information", () => {
    cy.visit("http://localhost:4173/");
    cy.get("#link-login-desktop").click();
    cy.get('#input-username').type('pertsa82');
    cy.get('#input-password').type('jes123');
    cy.get('#btn-login').click();
    cy.contains("Just DebugIt!");
    cy.get("#link-account-desktop").click();
    cy.get('#input-bio').type('I\'m here to learn new things!');
    cy.get('#btn-update-basic').click();
    cy.contains("@pertsa82").click();
    cy.contains("Bio: I\'m here to learn new things!");
  });
});
