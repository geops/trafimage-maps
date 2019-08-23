#

Configure your own map.

```jsx
import React from 'react';
import Layer from 'react-spatial/layers/Layer';
import TrajservLayer from 'react-transit/layers/TrajservLayer';
import defaultBaseLayers, { buslines } from '../../config/layers';
import CONF from '../../config/appConfig';

import TrafimageMaps from '../../components/TrafimageMaps';

<div style={{ position: 'relative', width: '100%', height: 500 }}>
  <TrafimageMaps
    topics={[{
      name: 'ÖV Netzkarte Schweiz',
      key: 'ch.sbb.netzkarte',
      layers: [
        ...defaultBaseLayers,
        new TrajservLayer({
          name: 'Zugtracker',
          key: 'ch.sbb.tracker',
        }),
        new TrajservLayer({
          name: 'ch.sbb.puenktlichkeit',
          key: 'ch.sbb.puenktlichkeit',
          visible: false,
          useDelayStyle: true,
          operator: ['SBB'], // To filter operator
          train: ['(IR|IC|EC|RJX|TGV)', '^(S|R$)'], // To filter train by name
        }),
        buslines,
      ],
    }]}
    apiKey="5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93"
    elements={{
      footer: true,
      header: true,
      mapControls: true,
      menu: true,
      popup: true,
    }}
    popupComponents={{
      'ch.sbb.bahnhofplaene.printprodukte': 'BahnhofplanPopup',
    }}
  />
</div>
```
