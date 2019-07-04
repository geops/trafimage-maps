#

This example shows a TrafimageMaps application together with layers for routing
and fare networks.

The positioning of labels inside the fare networks layer are optimized based on
the map extent and the used resolution.

```jsx
import React from 'react';
import TrafimageMaps from '../../components/TrafimageMaps';
import RouteLayer from '../../layers/RouteLayer';
import VerbundLayer from '../../layers/VerbundLayer';

const CasaExample = () => {
  // Intialization of fare network layer and route layer.
  const verbundLayer = new VerbundLayer();
  const routeLayer = new RouteLayer();

  // Visualize a route on the map.
  routeLayer.getRoute([
    {
      uicFrom: 8501000,
      uicTo: 8500010,
      mot:'rail',
    },
  ]);

  // Configuration of visible app elements.
  const elements = {
    menu: true, // I only want to show the menu 
  };

  // Render the component with react.
  return (
    <div style={{ position: 'relative', width: '100%', height: 500 }}>

      <TrafimageMaps
        topic="ch.sbb.casa"
        layers={[verbundLayer, routeLayer]}
        elements={elements}
      />

    </div>
  );
};

<CasaExample />;

```
