describe('Appointments', () => {
  xit('should book an interview', () => {
    cy.visit('/');

    cy.contains('[data-testid=day]', 'Monday');

    cy.get('[alt=Add]').first().click();

    cy.get('[placeholder="Enter Student Name"]').type('Rebecca');

    cy.get('[alt="Sylvia Palmer"]').click();

    cy.contains('button', 'Save').click();

    cy.contains('[data-testid=appointment]', 'Rebecca');
  });

  it('should edit an interview', () => {
    cy.visit('/');

    cy.contains('[data-testid=day]', 'Monday');

    cy.get('[alt=Edit]').first().click({ force: true });
  });
  // it('should cancel an interview', () => {});
});
