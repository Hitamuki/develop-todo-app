describe('Todo Application', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('ログイン後にタスク一覧画面に遷移されること', () => {
    cy.get('input[formControlName="email"]').type('test@example.com');
    cy.get('input[formControlName="password"]').type('password');
    cy.get('button[type="submit"]').click();

    // After successful login, it should navigate to the home/task list page
    cy.url().should('include', '/home');
    cy.get('ag-grid-angular').should('be.visible');
  });
});
