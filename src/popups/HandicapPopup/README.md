#

Example of the Handicap topic together with its menu component.

```jsx
import React from 'react';
import { handicap } from '../../config/topics';
import { HandicapMenu } from '../../config/menu';

import TrafimageMaps from '../../components/TrafimageMaps';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;

<div style={{ position: 'relative', width: '100%', height: 500 }}>
  <TrafimageMaps
    topics={[handicap]}
    apiKey={apiKey}
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
</div>;
```
