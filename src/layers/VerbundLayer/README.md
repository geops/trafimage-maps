#

Verbund layer.

```jsx
import React from 'react';
import TrafimageMaps from '../../components/TrafimageMaps';
import VerbundLayer from './VerbundLayer';

const VerbundLayerExample = () => {
  const verbundLayer = new VerbundLayer();

  return (
    <div style={{ position: 'relative', width: '100%', height: 500 }}>

      <TrafimageMaps
        topic="ch.sbb.netzkarte"
        layers={[verbundLayer]}
        elements={{
          menu: true,
          footer: true,
          baseLayerToggler: true,
        }}
      />

    </div>
  );
};

<VerbundLayerExample />;
```
