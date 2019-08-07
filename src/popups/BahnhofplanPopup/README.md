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
import { netzkarte } from '../../config/topics';

const BahnhofplanPopupExample = () => (
  <div style={{ position: 'relative', width: '100%', height: 500 }}>
    <TrafimageMaps
      topics={[netzkarte]}
      elements={{ popup: true }}
      popupComponents={{
        'ch.sbb.bahnhofplaene.printprodukte': 'BahnhofplanPopup',
      }}
    />

  </div>
);

<BahnhofplanPopupExample />;

```
