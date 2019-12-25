#

The Casa module is a sub module of trafimage-maps which is integrated in the SBB selling application. It is used for visualizing the planned [route](/docjs.html#routelayer) with different means of transportation and allows the selection of relevant [fare network](/docjs.html#zonelayer).

The used `apiKey` is a demo key. Please [request your own api key](http://developer.geops.io/) for using the application.

```jsx
import 'trafimage-maps';
import React, { useEffect, useRef } from 'react';
import RouteLayer from 'trafimage-maps/layers/RouteLayer';
import ZoneLayer from 'trafimage-maps/layers/ZoneLayer';
import casa from 'trafimage-maps/examples/Casa/topic';

// Intialization of zone layer.
const zoneLayer = new ZoneLayer({
  // Demo key. Please replace with your own key.
  apiKey: '5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93',
  validFrom: '2019-12-16',
  validTo: '2020-12-01',
});

// Select zones.
zoneLayer.loadZones([
  {
    partnerCode: 801,
    zones: [
      {
        zoneCode: 10,
        zoneName: 'Davos',
        isClickable: true,
      },
    ],
  },
  {
    partnerCode: 490,
    zones: [
      {
        zoneCode: 120,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 170,
      },
    ],
  },
]);

zoneLayer.onClick(f => {
  console.log('Clicked', f);
});

// Initialize route layer.
const routeLayer = new RouteLayer({
  key: 'ch.sbb.casa.routeLayer',
  // Demo apiKey. Please replace with your own apiKey.
  apiKey: '5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93',
  styleFunction: (props, isSelected, isHovered) => {
    if (isSelected && isHovered) {
      return {
        stroke: { color: 'green' },
      };
    }
  },
});

// Visualize a route on the map.
routeLayer
  .loadRoutes([
    {
      isClickable: true,
      popupTitle: 'Route St. Gallen >> Zürich',
      popupContent: {
        Von: 'St. Gallen',
        Nach: 'Zürich HB',
      },
      sequences: [
        {
          uicFrom: 8506302,
          uicTo: 8503000,
          mot: 'rail',
        },
      ],
    },
  ])
  .then(f => {
    routeLayer.zoomToRoute();
  });

routeLayer.onClick(f => {
  console.log('Clicked', f);
});

const App = () => {
  const ref = useRef();

  useEffect(() => {
    const map = ref.current;
    map.topics =  [{...casa, layers: [...casa.layers, zoneLayer, routeLayer]}];

    return () => {
      map.topics = null;
    };
  }, []);

  return (
    <div className="container">
      <trafimage-maps ref={ref} />
    </div>
  );
}

<App />

```
