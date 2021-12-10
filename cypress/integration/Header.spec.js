/* eslint-disable no-undef */
const viewports = [
  // Desktop
  {
    size: [1440, 900],
  },
  // Large mobile phone
  {
    preset: 'samsung-s10',
    orientation: 'portrait',
  },
  {
    preset: 'samsung-s10',
    orientation: 'landscape',
  },
  // Small mobile phone
  {
    preset: 'iphone-3',
    orientation: 'portrait',
  },
  {
    preset: 'iphone-3',
    orientation: 'landscape',
  },
  // Tablet
  {
    preset: 'ipad-2',
    orientation: 'portrait',
  },
  {
    preset: 'ipad-2',
    orientation: 'landscape',
  },
];

const setViewPort = (viewport) => {
  if (viewport.size) {
    cy.viewport(viewport.size[0], viewport.size[1]);
  } else {
    cy.viewport(viewport.preset, viewport.orientation);
  }
};

const getViewPortName = (viewport) => {
  if (viewport.size) {
    return viewport.size;
  }
  return `${viewport.preset}, ${viewport.orientation}`;
};

describe('Header components', () => {
  beforeEach(() => {
    cy.visit('');
  });

  // For each viewport
  viewports.forEach((viewport) => {
    describe(`${getViewPortName(viewport)} screen`, () => {
      it(`should display menu`, () => {
        setViewPort(viewport);
        cy.get('.wkp-menu-header').should('be.visible');
        cy.get('.wkp-topics-menu-body').should('not.be.visible');
        cy.get('.wkp-menu-header').click();

        // Menu should open
        cy.get('.wkp-topics-menu-body').should('be.visible');
      });

      it(`should display WKP login`, () => {
        setViewPort(viewport);
        cy.get('.wkp-login').should('be.visible');
        // Do not test click because of CORS problem
        // when redirecting to another page
      });

      it(`should display language select`, () => {
        setViewPort(viewport);
        cy.get('.wkp-single-value-wrapper').should('be.visible');

        // Click the react-select element
        cy.get('.wkp-header .css-m869aq-ValueContainer').click();

        // The select list should open
        cy.get('.wkp-header .css-13ee3a5-menu').should('be.visible');
      });

      it(`should display search input`, () => {
        setViewPort(viewport);

        // Small screens
        if (viewport.preset) {
          // Input is not visible
          cy.get('.wkp-search-input input').should('not.be.visible');

          // But the button
          cy.get('.wkp-search-toggle-button').should('be.visible');
          cy.get('.wkp-search-toggle-button').click();
        }

        // Input is visibile
        cy.get('.wkp-search-input input').should('be.visible');

        // Can type 'B'
        cy.get('.wkp-search-input input')
          .focus()
          .type('B')
          .should('have.value', 'B');
      });
    });
  });
});
