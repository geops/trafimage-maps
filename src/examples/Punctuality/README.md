#

This example shows how to integrate punctuality information in your map application.

```jsx
import 'trafimage-maps';
import React, { useRef, useEffect } from 'react';
import { Layer, TrajservLayer } from 'mobility-toolbox-js/src/ol/';
import defaultBaseLayers, {
  buslines,
} from 'trafimage-maps/examples/Punctuality/layers';
import defaultSearches from 'trafimage-maps/config/searches';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;

const App = () => {
  const ref = useRef();

  useEffect(() => {
    const map = ref.current;
    map.topics = [
      {
        name: 'ch.sbb.netzkarte',
        key: 'ch.sbb.netzkarte',
        layers: [
          ...defaultBaseLayers,
          new TrajservLayer({
            name: 'Zugtracker',
            key: 'ch.sbb.tracker',
            apiKey: apiKey,
          }),
          new TrajservLayer({
            name: 'ch.sbb.puenktlichkeit',
            key: 'ch.sbb.puenktlichkeit',
            apiKey: apiKey,
            visible: false,
            useDelayStyle: true,
            operator: 'SBB', // To filter operator
            publishedLineName: 's1,s2,s9,s10,s15', // To filter line number
          }),
          buslines,
        ],
        elements: {
          footer: true,
          header: false,
          mapControls: true,
          menu: true,
          popup: true,
          permalink: false,
          search: true,
        },
        searches: defaultSearches,
      },
    ];

    return () => {
      map.topics = null;
    };
  }, []);

  return (
    <div className="container">
      <trafimage-maps
        ref={ref}
        zoom="14"
        center="[950690,6004000]"
        apiKey={apiKey}
      />
    </div>
  );
};

<App />;
```
