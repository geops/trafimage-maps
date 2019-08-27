#

Configure your own map.

'TrajservLayer' Layer filter options (case insensitive):

| Options            | Description            | Examples                                                              |
|--------------------|------------------------|-----------------------------------------------------------------------|
| Operator           | filter by operator     | string: 'sbb', list: '(vbz\|zsg)'                                     |
| PublishedLineName  | filter by line name    | string: 'ICE',  list: 's1,s2,s9,s10,s15'                              |
| TripNumber         | filter by trip number  | bus in zurich: '2068', list of buses in Zurich: '2068,3003,3451,3953' |

```jsx
import React from 'react';
import Layer from 'react-spatial/layers/Layer';
import TrajservLayer from 'react-transit/layers/TrajservLayer';
import defaultBaseLayers, { buslines } from '../../config/layers';

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
          Operator: 'SBB', // To filter operator
          PublishedLineName: 's1,s2,s9,s10,s15', // To filter line number
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
