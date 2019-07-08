#

Configure your own map.

```jsx
import React from 'react';
import TrafimageMaps from './TrafimageMaps';

const TrafimageMapsExample = () => (
  <div style={{ position: 'relative', width: '100%', height: 500 }}>

    <TrafimageMaps
      topic="ch.sbb.netzkarte"
      elements={{
        footer: true,
        baseLayerToggler: true,
      }}
    />

  </div>
);

<TrafimageMapsExample />;
```
