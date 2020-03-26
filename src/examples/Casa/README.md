#

The Casa module is a sub module of trafimage-maps which is integrated in the SBB selling application. It is used for visualizing the planned [route](/docjs.html#routelayer) with different means of transportation and allows the selection of relevant [fare network](/docjs.html#zonelayer).

```jsx
import 'trafimage-maps';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import RouteLayer from 'trafimage-maps/layers/RouteLayer';
import ZoneLayer from 'trafimage-maps/layers/ZoneLayer';
import casa from 'trafimage-maps/examples/Casa/topic';
import 'trafimage-maps/examples/Casa/casa.css'

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;

// Intialization of zone layer.
const zoneLayer = new ZoneLayer({
  apiKey: apiKey,
  styleFunction: (props, isSelected, isHovered) => {
    // if (isSelected && !isHovered) {
    //   return {
    //     stroke: { color: '#ff0000' },
    //   };
    // }
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
        isSelected: false,
        isClickable: false,
      },
      {
        zoneCode: 124,
        isSelected: false,
        isClickable: false,
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
    // return {
    //   stroke: { color: 'blue' },
    // }
  },
});

// Visualize a route on the map.
routeLayer
  .loadRoutes([
    {
      isClickable: true,
      isSelected: true,
      popupTitle: 'Route St. Gallen >> Zürich',
      popupContent: {
        Von: 'St. Gallen',
        Nach: 'Zürich HB',
      },
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

  useEffect(() => {
    const map = ref.current;
    map.topics =  [{
      ...casa,
      layers: [...casa.layers, zoneLayer, routeLayer],
      elements: {
        mapControls: true,
        menu: true,
        popup: true,
      }}];

    return () => {
      map.topics = null;
    };
  }, []);

  const minus = useCallback(() => {
    let scale = (zoneLayer.getScale() ||1) - 0.1;
    zoneLayer.setScale(scale < 1 ? 1 : scale);
  }, []);

  const plus = useCallback(() => {
    let scale = (zoneLayer.getScale() || 1) + 0.1;
    zoneLayer.setScale(scale > 3 ? 3 : scale);
  }, []);
  
  /* To use casa style sheet, add the casa class in the parent class */
  return (
    <div className="container casa">
      <div>
        <button onClick={minus}>-</button>
        <button onClick={plus}>+</button>
      </div>
      <trafimage-maps ref={ref} apiKey={apiKey}/>
    </div>
  );
}

<App />

```
