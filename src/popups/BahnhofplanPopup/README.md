#

This example shows a popup for the two station plan layers 'Interactive Station Plan' and 'Print Products'.

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
