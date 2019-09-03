#

This example shows a TrafimageMaps application together with layers for routing
and fare networks.

The positioning of labels inside the fare networks layer are optimized based on
the map extent and the used resolution.

```jsx
import React from 'react';
import TrafimageMaps from '../../components/TrafimageMaps';
import BahnhofplanLayer from '../../layers/BahnhofplanLayer';

<div
  style={{
    position: 'relative',
    width: '100%',
    height: '300px'
  }}
>
  <TrafimageMaps
    topics={[{
      layers: [
        new BahnhofplanLayer({ visible: false }),
        new BahnhofplanLayer({ showPrintFeatures: true })
      ],
    }]}
    elements={{ popup: true }}
    popupComponents={{
      'ch.sbb.bahnhofplaene.printprodukte': 'BahnhofplanPopup',
    }}
  />
</div>
```
