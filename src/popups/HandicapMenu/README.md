#

Example of the Handicap topic together with its menu component.

```jsx
import React from 'react';
import { handicap } from '../../config/topics';
import { HandicapMenu } from '../../config/menu';

import TrafimageMaps from '../../components/TrafimageMaps';

<div style={{ position: 'relative', width: '100%', height: 500 }}>
  <TrafimageMaps
    topics={[handicap]}
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
    menuComponents={[
      {
        component: HandicapMenu,
        standalone: true,
        topic: 'ch.sbb.handicap',
      },
    ]}
  />
</div>
```
