describe('Visiting homepage', () => {
    it('Loads the grid page', () => {
        cy.visit('http://localhost:6173');
        cy.url().should('contain', 'cards/grid');

        cy.get('.card-grid-item').should('have.lengthOf', 11);
    });

    it('Switches the language', () => {
        cy.visit('http://localhost:6173');
        cy.url().should('contain', 'en-GB');
        cy.contains('About').should('exist');
        cy.get('#language-switch')
            .click()
            .then(() => {
                cy.get('.lang-switch-container').should('be.visible');
                cy.get('.lang-switch-container')
                    .children()
                    .should('have.length', 3 + 1); // 2 languages + 1 span

                cy.get('a[href*="fr-FR"]').should('be.visible').click({ force: true });
                cy.wait(500);
                cy.url().should('contain', 'fr-FR');
                cy.contains('À propos').should('exist');
            });
    });

    it('Switches the variant', () => {
        cy.visit('http://localhost:6173/fr-FR'); // 2 variants in french, only one in english
        cy.url().should('contain', 'v1.0');
        cy.get('.card-grid-item').should('have.lengthOf', 11);
        cy.get('.alerts-container').children().should('have.length', 0);

        cy.get('#variant-switch')
            .click()
            .then(() => {
                cy.get('.variant-switch-container').should('be.visible');
                cy.get('.variant-switch-container').children().should('have.length', 2);

                cy.get('a[href*="v0.0"]').should('be.visible').click({ force: true });
                cy.get('.card-grid-item').should('have.lengthOf', 10);
                cy.wait(500);
                cy.url().should('contain', 'v0.0');
                cy.get('.alerts-container').children().should('have.length', 1); // Deprecated message
            });
    });

    it('Switches lang and upgrade href lang (#258)', () => {
        cy.visit('http://localhost:6173/fr-FR/v0.0');
        cy.get('.alerts-container > .alert > span > a[href*="fr-FR"]').should('exist');
        cy.get('.lang-switch-container > a[href*="es-ES"]').click({ force: true });
        cy.wait(500);
        cy.get('.alerts-container > .alert > span > a[href*="es-ES"]').should('exist').click();
        cy.get('.alerts-container').children().should('have.length', 0);
    });
});
