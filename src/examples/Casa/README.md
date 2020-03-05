#

The Casa module is a sub module of trafimage-maps which is integrated in the SBB selling application. It is used for visualizing the planned [route](/docjs.html#routelayer) with different means of transportation and allows the selection of relevant [fare network](/docjs.html#zonelayer).

```jsx
import 'trafimage-maps';
import React, { useEffect, useRef } from 'react';
import RouteLayer from 'trafimage-maps/layers/RouteLayer';
import ZoneLayer from 'trafimage-maps/layers/ZoneLayer';
import casa from 'trafimage-maps/examples/Casa/topic';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;

// Intialization of zone layer.
const zoneLayer = new ZoneLayer({
  apiKey: apiKey,
  styleFunction: (props, isSelected, isHovered) => {
    if (isSelected && !isHovered) {
      return {
        stroke: { color: '#fff' },
      };
    }
    if (isHovered) {
      return {
        stroke: {width: 2, color: '#4576A2'},
        text: { color: '#4576A2'},
      };
    }
    return {
      stroke: { color: 'rgb(102, 102, 102, 0.2)'},
    }
  },
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
        zoneCode: 163,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 164,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 120,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 121,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 122,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 123,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 124,
        isSelected: false,
        isClickable: true,
      },
    ],
  },
  {
    partnerCode: 446,
    zones: [
      {
        zoneCode: 170,
        isSelected: false,
        isClickable: true,
      },
      {
        zoneCode: 116,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 126,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 626,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 710,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 700,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 701,
        isSelected: true,
        isClickable: true,
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
  apiKey: apiKey,
  styleFunction: (props, isSelected, isHovered) => {
    if (isSelected) {
      return {
        stroke: { color: 'rgb(235, 0, 0)' },
      };
    }
    if (isHovered) {
      return {
        stroke: { color: 'rgb(235, 0, 0)' },
      };
    }
    return {
      stroke: { color: 'rgb(235, 0, 0, 0.3)' },
    }
  },
});

// Visualize a route on the map.
routeLayer
  .loadRoutes([
    {
      isClickable: true,
      isSelected: true,
      sequences: [
        {
          uicFrom: 8503000,
          uicTo: 8506306,
          mot: 'rail',
        },
      ],
    },
    {
      isClickable: true,
      isSelected: false,
      sequences: [
        {
          uicFrom: 8503000,
          uicTo: 8506206,
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
  const classes = useStyles()
  console.log(classes)

  useEffect(() => {
    const map = ref.current;
    map.topics =  [{...casa, layers: [...casa.layers, zoneLayer, routeLayer]}];

    return () => {
      map.topics = null;
    };
  }, []);

  return (
    <div className="container">
      <trafimage-maps ref={ref} apiKey={apiKey}/>
    </div>
  );
}

<App />

```
