#

The Casa module is a sub module of trafimage-maps which is integrated in the SBB selling application. It is used for visualizing the planned [route](/docjs.html#routelayer) with different means of transportation and allows the selection of relevant [fare network](/docjs.html#zonelayer).

The used [APIs from geOps](https://developer.geops.io/) require a license key.

```jsx
import React from 'react';
import TrafimageMaps from '../../components/TrafimageMaps';
import RouteLayer from '../../layers/RouteLayer';
import ZoneLayer from '../../layers/ZoneLayer';
import casa from '../../config/Casa';

// Intialization of zone layer.
const zoneLayer = new ZoneLayer({
  // Demo key. Please replace with your own key.
  apiKey: '5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93',
  zoneStyleFunction: (zoneProps, isSelected) => {
    return {
      fill: {
        color: isSelected ? 'red' : 'rgb(255, 200, 25)',
      },
    };
  },
});

// Select zones.
zoneLayer.loadZones([
  {
    partnerCode: 801,
    zones: [{
      zoneCode: 10,
      zoneName: 'Davos',
      isClickable: true,
    }],
  },
  {
    partnerCode: 490,
    zones: [{
      zoneCode: 120,
      isSelected: true,
    },
    {
      zoneCode: 170,
    }],
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
  routeStyleFunction: (routeProps, isSelected) => {
    // return undefined to use default color (see param motColors)
    return isSelected ? 'blue' : undefined;
  },
});

// Visualize a route on the map.
routeLayer.loadRoutes([
  {
    isClickable: true,
    sequences: [
      {
        uicFrom: 8502024,
        uicTo: 8505000,
        mot: 'rail',
      },
      {
        uicFrom: 8508450,
        uicTo: 8589801,
        mot: 'bus',
      },
    ],
  },
  {
    isSelected: true,
    sequences: [
      {
        uicFrom: 8589801,
        uicTo: 8589775,
        mot: 'bus',
      },
    ],
  },
]).then((f) => {
  routeLayer.zoomToRoute();
});

routeLayer.onClick(f => {
    console.log('Clicked', f);
});

// Configuration of visible app elements.
const elements = {
  menu: true,
  popup: true,
};


<div style={{ position: 'relative', width: '100%', height: 500 }}>
  <TrafimageMaps
    topics={[casa]}
    apiKey="5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93"
    layers={[zoneLayer, routeLayer]}
    elements={elements}
  />
</div>;
```
