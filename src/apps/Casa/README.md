#

This example shows a TrafimageMaps application together with layers for routing
and fare networks.

The positioning of labels inside the fare networks layer are optimized based on
the map extent and the used resolution.

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
    }],
  },
  {
    partnerCode: 490,
    zones: [{
      zoneCode: 120,
    },
    {
      zoneCode: 170,
    }],
  },
]).then((f) => {
  zoneLayer.zoomToZones();
});

zoneLayer.onClick(f => {
    console.log('Clicked', f);
});

// Initialize route layer.
const routeLayer = new RouteLayer({
  key: 'ch.sbb.casa.routeLayer',
  // Demo apiKey. Please replace with your own apiKey.
  apiKey: '5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93',
});

// Visualize a route on the map.
routeLayer.loadRoutes([
  {
    uicFrom: 8501000,
    uicTo: 8500010,
    mot: 'rail',
  },
]);

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
    popupComponents={{
      'ch.sbb.casa.routeLayer': 'CasaRoutePopup',
    }}
  />
</div>;
```
