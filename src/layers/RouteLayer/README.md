#

Route layer.

```jsx
import React from 'react';
import TrafimageMaps from '../../components/TrafimageMaps';
import RouteLayer from './RouteLayer';

const RouteLayerExample = () => {
  const routeLayer = new RouteLayer();

  routeLayer.route([
    {
      uicFrom: 8501000,
      uicTo: 8500010,
      mot:'rail',
    },
  ]);

  return (
    <div style={{ position: 'relative', width: '100%', height: 500 }}>

      <TrafimageMaps
        topic="ch.sbb.netzkarte"
        layers={[routeLayer]}
        elements={{
          menu: true,
          footer: true,
          baseLayerToggler: true,
        }}
      />

    </div>
  );
};

<RouteLayerExample />;
```

