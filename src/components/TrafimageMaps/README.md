#

Configure your own map.

```jsx
import React from 'react';
import TrafimageMaps from './TrafimageMaps';

const TrafimageMapsExample = () => (
  <div style={{ position: 'relative', width: '100%', height: 500 }}>

    <TrafimageMaps
      topic="ch.sbb.netzkarte"
      token="5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93"
      elements={{
        footer: true,
      }}
    />

  </div>
);

<TrafimageMapsExample />;
```
