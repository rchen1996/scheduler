describe('Navigation', () => {
  it('should visit root', () => {
    cy.visit('/');
  });

  it('should navigate to Tuesday', () => {
    cy.visit('/');

    cy.contains(`[data-testid=day]`, 'Tuesday')
      .click()
      .should('have.class', 'day-list__item--selected');
  });

  it('should book an interview', () => {
    cy.visit('/');

    cy.contains('[data-testid=day]', 'Monday');

    cy.get('[alt=Add]').first().click();

    cy.get('[placeholder="Enter Student Name"]').type('Rebecca');

    cy.get('[alt="Sylvia Palmer"]').click();

    cy.contains('button', 'Save').click();

    cy.contains('[data-testid=appointment]', 'Rebecca');
  });

  // it('should edit an interview', () => {});
  // it('should cancel an interview', () => {});
});
