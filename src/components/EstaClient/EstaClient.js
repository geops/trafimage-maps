/* eslint-disable default-case */
import React, { useEffect } from 'react';

function EstaClient() {
  useEffect(() => {
    const client = document.createElement('sbb-journey-maps-wc');

    client.language = 'en';
    client.apiKey = '4a6dca7396895a262d76584d7b203f8e';

    client.styleOptions = {
      mode: 'bright',
    };

    client.uiOptions = {
      homeButton: true,
    };

    client.poiOptions = {
      categories: [
        'park_rail',
        'car_sharing',
        'bike_parking',
        'bike_sharing',
        'on_demand',
      ],
      environment: 'prod',
      includePreview: true,
    };

    client.markerOptions = {
      popup: true,
      markers: [
        {
          id: 'velo',
          title: 'Basel - Bahnhof SBB',
          subtitle: 'Rent a Bike - Ihr Mietvelo',
          position: [7.5897, 47.5476],
          category: 'BIKE-PROFILE-SIGN-PARKING',
        },
        {
          id: 'work',
          title: 'Office',
          subtitle: 'SBB Wylerpark',
          position: [7.44645, 46.961409],
          category: 'MISSED-CONNECTION',
        },
      ],
    };

    client.listenerOptions = {
      ZONE: {
        watch: true,
        selectionMode: 'multi',
      },
      POI: {
        watch: true,
        popup: false,
        clickTemplate: 'myTemplate',
      },
      MARKER: { watch: true },
      STATION: {
        watch: true,
        popup: true,
        clickTemplate: 'myTemplate',
      },
      ROUTE: {
        watch: true,
      },
    };

    client.addEventListener('featuresClick', (event) => {
      const feature = event.detail?.features?.[0];
      switch (feature?.featureDataType) {
        case 'POI':
          document.getElementById('myTemplate').innerHTML = `
          <div>
          <h2>${feature.properties?.name}</h2>
          <div>${feature.properties?.sbbId}</div>
          </div>
          `;
          break;
        case 'MARKER':
          document.getElementById('myTemplate').innerHTML = `
          <div>
            <h2>${feature.properties?.title}</h2>
            <div>${feature.properties?.subtitle}</div>
          </div>
        `;
          break;
        case 'STATION':
          document.getElementById('myTemplate').innerHTML = `
          <div>
            <h2>${feature.properties?.name}</h2>
            <div>${feature.properties?.sbb_id}</div>
          </div>
        `;
          break;
        case 'ROUTE':
          document.getElementById('myTemplate').innerHTML = `
          <div>
            <div>${feature.properties?.routeId}</div>
          </div>
        `;
          break;
      }
    });

    client.addEventListener('mapCenterChange', (event) => {
      console.log('mapCenterChange: ', event.detail);
      // mapCenterChangeSubject.next(event.detail);
    });

    client.addEventListener('selectedLevelChange', (event) =>
      console.log('selectedLevelChange: ', event.detail),
    );

    document.getElementById('my-map-container').appendChild(client);
  }, []);

  return (
    <>
      <div
        id="my-map-container"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'yellow',
        }}
      />
      {/* <sbb-journey-maps-wc
        ref={(node) => setClient(node)}
        // api-key="4782e0cdef173b15bdaf3ce4fc07ce4f"
        api-key="4a6dca7396895a262d76584d7b203f8e"
        lang="en"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'yellow',
        }}
        show-basemap-switch="true"
      /> */}
    </>
  );
}

export default EstaClient;
