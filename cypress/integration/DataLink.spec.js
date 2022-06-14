describe('A link to data', () => {
  const openDataText = 'Diesen Datensatz beziehen (Open Data)';
  beforeEach(() => {
    cy.visit('');
    cy.get('#onetrust-accept-btn-handler', { timeout: 100000 }).click();
    cy.get('.wkp-menu-header').click();
  });

  it('is available for direktverbindung layer', () => {
    // Click info button
    cy.get(':nth-child(1) > .rs-layer-tree-item > button').click();
    cy.get(
      'a[href="https://data.sbb.ch/explore/dataset/direktverbindungen/information/"]',
    )
      .should(([a]) => {
        expect(a.textContent).to.equal(openDataText);
        expect(a.target).to.equal('_blank');
        // eslint-disable-next-line no-param-reassign
        a.target = '_self';
      })
      .click();
    cy.url().should(
      'equal',
      'https://data.sbb.ch/explore/dataset/direktverbindungen/information/',
    );
  });

  it('is available for bahnhofplaene layer', () => {
    // Click info button
    cy.get(':nth-child(2) > .rs-layer-tree-item > button').click();
    cy.get(
      'a[href="https://data.sbb.ch/explore/dataset/haltestelle-karte-trafimage/information/"]',
    )
      .should(([a]) => {
        expect(a.textContent).to.equal(openDataText);
        expect(a.target).to.equal('_blank');
        // eslint-disable-next-line no-param-reassign
        a.target = '_self';
      })
      .click();
    cy.url().should(
      'equal',
      'https://data.sbb.ch/explore/dataset/haltestelle-karte-trafimage/information/',
    );
  });

  it('is available for passagierfrequenzen layer', () => {
    // Click info button
    cy.get(':nth-child(5) > .rs-layer-tree-item > button').click();
    cy.get('a[href="https://reporting.sbb.ch/bahnhoefe"]')
      .should(([a]) => {
        expect(a.textContent).to.equal(
          'Diesen Datensatz beziehen (Statistikportal)',
        );
        expect(a.target).to.equal('_blank');
        // eslint-disable-next-line no-param-reassign
        a.target = '_self';
      })
      .click();
    cy.url().should('equal', 'https://reporting.sbb.ch/bahnhoefe');
  });

  it('is available for construction topic', () => {
    // Click info button
    cy.get(
      ':nth-child(2) > .wkp-topic-menu-item-wrapper > .wkp-topic-icons > button',
    ).click();
    cy.get(
      'a[href="https://data.sbb.ch/explore/dataset/construction-projects/information/"]',
    )
      .should(([a]) => {
        expect(a.textContent).to.equal(openDataText);
        expect(a.target).to.equal('_blank');
        // eslint-disable-next-line no-param-reassign
        a.target = '_self';
      })
      .click();
    cy.url().should(
      'equal',
      'https://data.sbb.ch/explore/dataset/construction-projects/information/',
    );
  });

  it('is available for handicap topic', () => {
    // Click info button
    cy.get(
      ':nth-child(3) > .wkp-topic-menu-item-wrapper > .wkp-topic-icons > button',
    ).click();
    cy.get(
      'a[href="https://data.sbb.ch/explore/dataset/barrierefreies-reisen/information/"]',
    )
      .should(([a]) => {
        expect(a.textContent).to.equal(openDataText);
        expect(a.target).to.equal('_blank');
        // eslint-disable-next-line no-param-reassign
        a.target = '_self';
      })
      .click();
    cy.url().should(
      'equal',
      'https://data.sbb.ch/explore/dataset/barrierefreies-reisen/information/',
    );
  });
});
