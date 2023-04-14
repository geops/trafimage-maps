/* eslint-disable import/no-extraneous-dependencies */
import { WebSocket, Server } from 'mock-socket';

describe('ch.sbb.netzkarte', () => {
  beforeEach(() => {
    cy.consent();
  });

  describe('punctuality layers', () => {
    let bufferMessage;
    let fullTrajectoryMessage;
    let stopSequenceMessage;
    let now;
    let mockServer;
    const coord = [810000, 5900000];
    const coord2 = [811000, 5901000];
    const trainId = 'foo';

    const visitWithMsg = (url, message) => {
      cy.visit(url, {
        onBeforeLoad: (win) => {
          // Stub out JS WebSocket
          cy.stub(win, 'WebSocket', (wsUrl) => {
            return new WebSocket(wsUrl);
          });
        },
      });
      cy.get('.wkp-menu-header').click();
      cy.get(
        ':nth-child(6) > .rs-layer-tree-item > .rs-layer-tree-input > span',
      ).click();
      cy.wait(3000).then(() => {
        mockServer.emit('message', JSON.stringify(message));
      });
    };

    beforeEach(() => {
      // Create mock server
      mockServer = new Server('wss://tralis-tracker-api.geops.io/ws');
      now = Date.now();
      bufferMessage = {
        source: 'buffer',
        timestamp: now,
        client_reference: '',
        content: [
          {
            source: 'trajectory',
            timestamp: 1668783726870,
            client_reference: '',
            content: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [coord, coord],
              },
              properties: {
                bounds: [0, 0, 30000000, 30000000],
                gen_level: null,
                gen_range: [-32767, 32767],
                tenant: 'sbb',
                type: 'rail',
                time_intervals: [
                  [now - 1000000, 0, 0],
                  [now - 1000000, 0, 0],
                  [now + 1000000, 1, 0],
                  [now + 1000000, 1, 0],
                ],
                train_id: trainId,
                event_timestamp: now,
                line: {
                  id: 12396459,
                  name: 'TER',
                  color: null,
                  text_color: null,
                  stroke: null,
                },
                timestamp: now,
                state: 'DRIVING',
                time_since_update: null,
                has_realtime: false,
                has_realtime_journey: true,
                operator_provides_realtime_journey: 'maybe',
                has_journey: true,
                route_identifier: '016274.000773.001:752',
                delay: 0,
              },
            },
          },
        ],
      };
      fullTrajectoryMessage = {
        source: `full_trajectory_${trainId}_gen10`,
        timestamp: now,
        client_reference: '',
        content: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'GeometryCollection',
                geometries: [
                  {
                    type: 'LineString',
                    coordinates: [
                      [coord[0] - 100000, coord[1] - 100000],
                      [coord[0] + 100000, coord[1] + 100000],
                    ],
                  },
                  {
                    type: 'MultiPoint',
                    coordinates: [
                      [coord[0] - 100000, coord[1] - 100000],
                      [coord[0] + 100000, coord[1] + 100000],
                    ],
                  },
                ],
              },
              properties: {
                train_id: trainId,
                gen_level: 30,
                gen_range: [20, 65],
                journey_id: 1036289471,
                line_id: 12581962,
                stroke: '#ffea00',
                line_name: 'S2',
                type: 'rail',
                event_timestamp: 1669109092318,
              },
            },
          ],
          properties: {
            train_id: trainId,
            gen_level: 30,
            gen_range: [20, 65],
            tenant: 'sbb',
            publisher: 'SBB',
            publisherUrl: 'http://www.sbb.ch',
            operator: 'BLS-bls (BLS AG (bls))',
            operatorUrl: 'http://www.sbb.ch',
            license: null,
            licenseUrl: null,
            licenseNote: null,
          },
        },
      };
      stopSequenceMessage = {
        source: `stopsequence_${trainId}`,
        timestamp: now,
        client_reference: '',
        content: [
          {
            id: trainId,
            color: '#ffea00',
            stroke: '#ffea00',
            text_color: '#000000',
            destination: 'Langnau i.E.',
            new_destination: null,
            longName: 'S6',
            routeIdentifier: '022644.000033.101:6',
            shortName: 'S6',
            type: 'rail',
            stations: [
              {
                state: 'LEAVING',
                formation_id: null,
                arrivalDelay: null,
                arrivalTime: now,
                aimedArrivalTime: now,
                cancelled: false,
                departureDelay: 0,
                departureTime: 1669117440000,
                aimedDepartureTime: 1669117440000,
                noDropOff: false,
                noPickUp: false,
                stationId: null,
                stationName: 'Wolhusen',
                coordinate: [899434, 5951136],
              },
              {
                state: 'LEAVING',
                formation_id: null,
                arrivalDelay: 0,
                arrivalTime: 1669117860000,
                aimedArrivalTime: 1669117860000,
                cancelled: false,
                departureDelay: 60000,
                departureTime: 1669117920000,
                aimedDepartureTime: 1669117860000,
                noDropOff: false,
                noPickUp: false,
                stationId: null,
                stationName: 'Entlebuch',
                coordinate: [897498, 5941045],
              },
              {
                state: 'LEAVING',
                formation_id: null,
                arrivalDelay: 60000,
                arrivalTime: 1669118040000,
                aimedArrivalTime: 1669117980000,
                cancelled: false,
                departureDelay: 120000,
                departureTime: 1669118100000,
                aimedDepartureTime: 1669117980000,
                noDropOff: false,
                noPickUp: false,
                stationId: null,
                stationName: 'Hasle LU',
                coordinate: [895786, 5938509],
              },
              {
                state: 'LEAVING',
                formation_id: null,
                arrivalDelay: 0,
                arrivalTime: 1669118280000,
                aimedArrivalTime: 1669118280000,
                cancelled: false,
                departureDelay: 0,
                departureTime: 1669118340000,
                aimedDepartureTime: 1669118340000,
                noDropOff: false,
                noPickUp: false,
                stationId: null,
                stationName: 'Schüpfheim',
                coordinate: [892243, 5934022],
              },
              {
                state: null,
                formation_id: null,
                arrivalDelay: 60000,
                arrivalTime: 1669118760000,
                aimedArrivalTime: 1669118700000,
                cancelled: false,
                departureDelay: 60000,
                departureTime: 1669118760000,
                aimedDepartureTime: 1669118700000,
                noDropOff: false,
                noPickUp: false,
                stationId: null,
                stationName: 'Escholzmatt',
                coordinate: [883474, 5928268],
              },
              {
                state: null,
                formation_id: null,
                arrivalDelay: 60000,
                arrivalTime: 1669119240000,
                aimedArrivalTime: 1669119180000,
                cancelled: false,
                departureDelay: 0,
                departureTime: 1669119300000,
                aimedDepartureTime: 1669119300000,
                noDropOff: false,
                noPickUp: false,
                stationId: null,
                stationName: 'Trubschachen',
                coordinate: [873429, 5929303],
              },
              {
                state: null,
                formation_id: null,
                arrivalDelay: 0,
                arrivalTime: 1669119660000,
                aimedArrivalTime: 1669119660000,
                cancelled: false,
                departureDelay: 0,
                departureTime: 1669119660000,
                aimedDepartureTime: 1669119660000,
                noDropOff: false,
                noPickUp: false,
                stationId: null,
                stationName: 'Langnau i.E.',
                coordinate: [866533, 5932162],
              },
            ],
            tenant: 'sbb',
            publisher: 'SBB',
            publisherUrl: 'http://www.publisher.url',
            operator: 'BLS-bls (BLS AG (bls))',
            operatorUrl: 'http://www.operator.url',
            license: null,
            licenseUrl: null,
            licenseNote: null,
          },
        ],
      };
    });

    afterEach(() => {
      mockServer.stop();
    });

    it('should display the full trajectory on click', () => {
      visitWithMsg('/ch.sbb.netzkarte', bufferMessage);

      // Click on the vehicle
      cy.get('.rs-map').click('center');

      // Display full trajectory a big gray line between (nearly) Geneve and (nearly) Zurich with points at both ends.
      cy.wait(2000).then(() => {
        mockServer.emit('message', JSON.stringify(fullTrajectoryMessage));
      });
      cy.wait(2000);
      cy.get('canvas').then((elts) => {
        const lineCanvas = elts[1];

        cy.fixture('fullTrajectory.png').then((fixture) => {
          cy.task('comparePng', {
            current: lineCanvas.toDataURL('image/png'),
            fixture: `data:image/png;base64,${fixture}`,
          }).then((result) => {
            cy.task(
              'log',
              `mismatch (<0.5 to pass test): ${result.rawMisMatchPercentage}`,
            ).then(() => {
              // Mismatch tolerance of < 0.5 to avoid detecting micro differences in pixels
              expect(result.rawMisMatchPercentage < 0.5).to.equal(true);
            });
          });
        });
      });

      // Display Tracker menu with stop sequences.
      cy.wait(2000).then(() => {
        mockServer.emit('message', JSON.stringify(stopSequenceMessage));
      });

      // Test stop sequence is displayed
      const {
        destination,
        stations,
        publisher,
        publisherUrl,
        operator,
        operatorUrl,
      } = stopSequenceMessage.content[0];
      cy.contains('div', destination);
      stations.forEach((station) => {
        cy.contains('div', station.stationName);
      });
      cy.contains(`a[href="${operatorUrl}"]`, operator);
      cy.contains(`a[href="${publisherUrl}"]`, publisher);
    });

    describe('receiving a bus and a train', () => {
      // One train and one bus
      const buffer = {
        source: 'buffer',
        timestamp: now,
        client_reference: '',
        content: [
          {
            source: 'trajectory',
            timestamp: 1668783726870,
            client_reference: '',
            content: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [coord2, coord2],
              },
              properties: {
                bounds: [0, 0, 30000000, 30000000],
                gen_level: null,
                gen_range: [-32767, 32767],
                tenant: 'sbb',
                type: 'rail',
                time_intervals: [
                  [now - 1000000, 0, 0],
                  [now - 1000000, 0, 0],
                  [now + 1000000, 1, 0],
                  [now + 1000000, 1, 0],
                ],
                train_id: `${trainId}rail`,
                event_timestamp: now,
                line: {
                  id: 12396459,
                  name: 'TER',
                  color: null,
                  text_color: null,
                  stroke: null,
                },
                timestamp: now,
                state: 'DRIVING',
                time_since_update: null,
                has_realtime: false,
                has_realtime_journey: true,
                operator_provides_realtime_journey: 'maybe',
                has_journey: true,
                route_identifier: '016274.000773.001:752',
                delay: 0,
              },
            },
          },
          {
            source: 'trajectory',
            timestamp: 1668783726870,
            client_reference: '',
            content: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [coord, coord],
              },
              properties: {
                bounds: [0, 0, 30000000, 30000000],
                gen_level: null,
                gen_range: [-32767, 32767],
                tenant: 'sbb',
                type: 'bus',
                time_intervals: [
                  [now - 1000000, 0, 0],
                  [now - 1000000, 0, 0],
                  [now + 1000000, 1, 0],
                  [now + 1000000, 1, 0],
                ],
                train_id: trainId,
                event_timestamp: now,
                line: {
                  id: 12396459,
                  name: '752',
                  color: null,
                  text_color: null,
                  stroke: null,
                },
                timestamp: now,
                state: 'DRIVING',
                time_since_update: null,
                has_realtime: false,
                has_realtime_journey: true,
                operator_provides_realtime_journey: 'maybe',
                has_journey: true,
                route_identifier: '016274.000773.001:752',
                delay: 0,
              },
            },
          },
        ],
      };

      it('should not display bus at zoom 9', () => {
        visitWithMsg('/ch.sbb.netzkarte?z=9', buffer);
        cy.get('canvas').then((elts) => {
          const vehicleCanvas = elts[2];

          cy.fixture('noBusAtZoom9.png').then((fixture) => {
            cy.task('comparePng', {
              current: vehicleCanvas.toDataURL('image/png'),
              fixture: `data:image/png;base64,${fixture}`,
            }).then((result) => {
              cy.task(
                'log',
                `mismatch (<0.1 to pass test): ${result.rawMisMatchPercentage}`,
              ).then(() => {
                // Canvas to compare are pretty empty so we use a lower mismatch.
                expect(result.rawMisMatchPercentage < 0.1).to.equal(true);
              });
            });
          });
        });
      });

      it('should display bus at zoom 14', () => {
        visitWithMsg('/ch.sbb.netzkarte?z=14', buffer);
        cy.get('canvas').then((elts) => {
          const vehicleCanvas = elts[2];

          cy.fixture('busAtZoom14.png').then((fixture) => {
            cy.task('comparePng', {
              current: vehicleCanvas.toDataURL('image/png'),
              fixture: `data:image/png;base64,${fixture}`,
            }).then((result) => {
              cy.task(
                'log',
                `mismatch (<0.1 to pass test): ${result.rawMisMatchPercentage}`,
              ).then(() => {
                // Canvas to compare are pretty empty so we use a lower mismatch.
                expect(result.rawMisMatchPercentage < 0.2).to.equal(true);
              });
            });
          });
        });
      });
    });
  });
});
