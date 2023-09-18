const ignoreDataLinkError = (url) =>
  cy.origin(url, () => {
    cy.on('uncaught:exception', () => {
      // Exception triggered by bad code on js when loading the targeted page
      // It will break the test by defualt if we don't return false.
      // So let the test continue.
      return false;
    });
  });

// This test use chromeWebSecurity=false, it doesn't work on firefox.
describe('A link to data', { browser: '!firefox' }, () => {
  const openDataText = 'Diesen Datensatz beziehen (Open Data)';
  beforeEach(() => {
    cy.consent();
    cy.visit('');
    cy.get('.wkp-menu-header', { timeout: 20000 }).click();
  });

  it('is available for direktverbindung topic', () => {
    ignoreDataLinkError('https://data.sbb.ch');
    // Click info button
    cy.get(
      ':nth-child(3) > .wkp-topic-menu-item-wrapper > .wkp-topic-icons > button',
    ).click();
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
    ignoreDataLinkError('https://data.sbb.ch');
    // Click info button
    cy.get(':nth-child(1) > .rs-layer-tree-item > button').click();
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
    ignoreDataLinkError('https://reporting.sbb.ch');

    // Click info button
    cy.get(':nth-child(4) > .rs-layer-tree-item > button').click();
    cy.get('a[href="https://reporting.sbb.ch/verkehr?highlighted=row-243"]')
      .should(([a]) => {
        expect(a.textContent).to.equal(
          'Diesen Datensatz beziehen (SBB Statistikportal)',
        );
        expect(a.target).to.equal('_blank');
        // eslint-disable-next-line no-param-reassign
        a.target = '_self';
      })
      .click();
    cy.url().should(
      'match',
      new RegExp(
        /https:\/\/reporting\.sbb\.ch\/verkehr\?highlighted=row-243.*/,
      ),
    );
  });

  it('is available for construction topic', () => {
    ignoreDataLinkError('https://data.sbb.ch');
    // Click info button
    cy.get(
      ':nth-child(5) > .wkp-topic-menu-item-wrapper > .wkp-topic-icons > button',
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

  it('is available for isb topic', () => {
    ignoreDataLinkError('https://data.sbb.ch');
    // Click info button
    cy.get(
      ':nth-child(9) > .wkp-topic-menu-item-wrapper > .wkp-topic-icons > button',
    ).click();
    cy.get(
      'a[href="https://data.sbb.ch/explore/dataset/infrastrukturbetreiberinnen/information/"]',
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
      'https://data.sbb.ch/explore/dataset/infrastrukturbetreiberinnen/information/',
    );
  });

  it('is available for handicap topic', () => {
    cy.origin('https://data.sbb.ch', () => {
      cy.on('uncaught:exception', () => {
        // Exception triggered by bad code on js when loading the targeted page
        // It will break the test by defualt if we don't return false.
        // So let the test continue.
        return false;
      });
    });
    // Click info button
    cy.get(
      ':nth-child(6) > .wkp-topic-menu-item-wrapper > .wkp-topic-icons > button',
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
