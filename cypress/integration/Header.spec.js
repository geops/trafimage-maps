/* eslint-disable no-undef */

const expectBaseLayersSelectVisible = () => {
  cy.get('.rs-base-layer-switcher').should('be.hidden');
  cy.get('[data-cy=baselayer-select]').should('be.visible');
};

const expectBaseLayersSwitcherVisible = () => {
  cy.get('.rs-base-layer-switcher').should('be.visible');
  cy.get('[data-cy=baselayer-select]').should('be.hidden');
};
const expectDevPortalLinkVisible = () => {
  cy.get('.wkp-dev-portal-link').should('be.visible');
};
const expectDevPortalLinkHidden = () => {
  cy.get('.wkp-dev-portal-link').should('be.hidden');
};

const expectOnWidthXs = () => {
  expectBaseLayersSelectVisible();
  expectDevPortalLinkHidden();
};

// const expectOnWidthS = () => {
//   expectBaseLayersSelectVisible();
//   expectDevPortalLinkVisible();
// };

const expectOnWidthMd = () => {
  expectBaseLayersSelectVisible();
  expectDevPortalLinkVisible();
};

const expectOnWidthLg = () => {
  expectBaseLayersSwitcherVisible();
  expectDevPortalLinkVisible();
};

const viewports = [
  // Desktop
  {
    size: [1440, 900],
    otherExpect: [expectOnWidthLg],
  },
  // Large mobile phone
  {
    preset: 'samsung-s10',
    orientation: 'portrait',
    otherExpect: [expectOnWidthXs],
  },
  {
    preset: 'samsung-s10',
    orientation: 'landscape',
    otherExpect: [expectOnWidthMd],
  },
  // Small mobile phone
  {
    preset: 'iphone-3',
    orientation: 'portrait',
    otherExpect: [expectOnWidthXs],
  },
  {
    preset: 'iphone-3',
    orientation: 'landscape',
    otherExpect: [expectOnWidthXs],
  },
  // Tablet
  {
    preset: 'ipad-2',
    orientation: 'portrait',
    otherExpect: [expectOnWidthMd],
  },
  {
    preset: 'ipad-2',
    orientation: 'landscape',
    otherExpect: [expectOnWidthLg],
  },
];

const setViewPort = (viewport) => {
  if (viewport.size) {
    cy.viewport(viewport.size[0], viewport.size[1]);
  } else {
    cy.viewport(viewport.preset, viewport.orientation);
  }
  // Click the consent button
  cy.get('#onetrust-accept-btn-handler').click();
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
        cy.get('.wkp-topics-menu-body').should('not.exist');
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
        cy.get('[data-cy=lang-select]').should('be.visible');

        // Click the react-select element
        cy.get('[data-cy=lang-select]').click();

        // The select list should open
        cy.get('[data-cy=lang-select-options]').should('be.visible');
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

      it('should be visible depending on size', () => {
        setViewPort(viewport);
        cy.get('.wkp-menu-header').click(); // Ensure the menu is open
        viewport.otherExpect.forEach((expect) => expect());
      });
    });
  });
});
