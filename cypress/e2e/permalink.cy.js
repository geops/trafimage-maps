describe('permalink', () => {
  describe('"disabled" parameter', () => {
    describe('using default topic', () => {
      it("should display some elements when it's not set", () => {
        cy.visit('/');
        cy.get('.tm-trafimage-maps').should('exist');

        // header + telephoneinfos
        cy.get('.wkp-header').should('exist');
        // search
        cy.get('.wkp-search').should('exist');
        // telephoneInfos
        cy.get('.wkp-tel-infos').should('exist');
        // menu
        cy.get('.wkp-topics-menu').should('exist');
        // baseLayerSwitcher
        cy.get('.rs-base-layer-switcher').should('exist');
        // mapControls
        cy.get('.wkp-map-controls').should('exist');
        // geolocationButton
        cy.get('.wkp-fit-extent').should('exist');
        // fitExtent
        cy.get('.wkp-geolocation').should('exist');
        // zoomSlider
        cy.get('.rs-zoomslider-wrapper').should('exist');
        // footer
        cy.get('.wkp-footer').should('exist');

        cy.get('.wkp-menu-header').click();
        // drawMenu
        cy.get('.wkp-draw-menu').should('exist');
        // shareMenu
        cy.get('.wkp-share-menu').should('exist');

        // See tarifverbundkarte topic for this test
        // exportMenu
        cy.get('.wkp-export-menu').should('not.exist');

        // TODO need to pass a custom menu for this topic
        // topicMenu

        // TODO need to click on a vehicle
        // trackerMenu

        // TODO need to click on kilometers layer
        // popup

        // TODO need to click on a station
        // overlay

        // TODO no topic are using it
        // featureMenu

        // permalink
        cy.url().should(
          'match',
          new RegExp(
            'baselayers=ch.sbb.netzkarte,ch.sbb.netzkarte.dark,ch.sbb.netzkarte.luftbild.group,ch.sbb.netzkarte.landeskarte,ch.sbb.netzkarte.landeskarte.grau',
          ),
        );

        cy.url().should(
          'match',
          new RegExp('lang=de&layers=&x=810000&y=5900000&z=8'),
        );
      });

      it('should hide header', () => {
        cy.visit('/?disabled=header');
        cy.get('.tm-trafimage-maps').should('exist');
        cy.get('.wkp-header').should('not.exist');
        cy.get('.wkp-tel-infos').should('not.exist');
      });

      it('should hide topics menu', () => {
        cy.visit('/?disabled=menu');
        cy.get('.tm-trafimage-maps').should('exist');
        cy.get('.wkp-topics-menu').should('not.exist');
      });

      it('should hide base layer switcher', () => {
        cy.visit('/?disabled=baseLayerSwitcher');
        cy.get('.tm-trafimage-maps').should('exist');
        cy.get('.rs-base-layer-switcher').should('not.exist');
      });

      it('should hide maps controls', () => {
        cy.visit('/?disabled=mapControls');
        cy.get('.tm-trafimage-maps').should('exist');
        cy.get('.wkp-map-controls').should('not.exist');
      });

      it('should fit extent button', () => {
        cy.visit('/?disabled=fitExtent');
        cy.get('.wkp-map-controls').should('exist');
        cy.get('.wkp-fit-extent').should('not.exist');
      });

      it('should hide geolocation button', () => {
        cy.visit('/?disabled=geolocationButton');
        cy.get('.wkp-map-controls').should('exist');
        cy.get('.wkp-geolocation').should('not.exist');
      });

      it('should hide zoom slider', () => {
        cy.visit('/?disabled=zoomSlider');
        cy.get('.wkp-map-controls').should('exist');
        cy.get('.rs-zoomslider-wrapper').should('not.exist');
      });

      it('should hide footer', () => {
        cy.visit('/?disabled=footer');
        cy.get('.tm-trafimage-maps').should('exist');
        cy.get('.wkp-footer').should('not.exist');
      });

      it('should hide draw menu', () => {
        cy.visit('/?disabled=drawMenu');
        cy.get('.tm-trafimage-maps').should('exist');
        cy.get('.wkp-menu-header').click();
        cy.get('.wkp-draw-menu').should('not.exist');
      });

      it('should hide share menu', () => {
        cy.visit('/?disabled=shareMenu');
        cy.get('.tm-trafimage-maps').should('exist');
        cy.get('.wkp-menu-header').click();
        cy.get('.wkp-share-menu').should('not.exist');
      });

      it('should hide export menu', () => {
        cy.visit('/ch.sbb.tarifverbundkarte.public?disabled=exportMenu');
        cy.get('.tm-trafimage-maps').should('exist');
        cy.get('.wkp-menu-header').click();
        cy.get('.wkp-export-menu').should('not.exist');
      });

      it('should deactivate permalink parameter', () => {
        cy.visit('/?disabled=permalink');
        cy.get('.tm-trafimage-maps').should('exist');
        cy.url().should('match', /\?disabled=permalink/);
      });

      it('should hide manage a list of value, for example header and footer', () => {
        cy.visit('/?disabled=header,footer');
        cy.get('.tm-trafimage-maps').should('exist');
        cy.get('.wkp-header').should('not.exist');
        cy.get('.wkp-tel-infos').should('not.exist');
        cy.get('.wkp-footer').should('not.exist');
      });
    });

    describe('using tarifverbundkarte topic', () => {
      it("should display some elements when it's not set", () => {
        cy.visit('/ch.sbb.tarifverbundkarte.public');
        cy.get('.wkp-menu-header').click();
        cy.get('.tm-trafimage-maps').should('exist');
        // See tarifverbundkarte topic for this test
        // exportMenu
        cy.get('.wkp-export-menu').should('exist');
      });

      it('should hide export menu', () => {
        cy.visit('/ch.sbb.tarifverbundkarte.public?disabled=exportMenu');
        cy.get('.wkp-menu-header').click();
        cy.get('.tm-trafimage-maps').should('exist');
        cy.get('.wkp-export-menu').should('not.exist');
      });
    });
  });
});
