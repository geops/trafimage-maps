Example how to create your own topic.

```jsx
import 'trafimage-maps';
import React, { useRef, useEffect } from 'react';
import TrafimageMapboxLayer from 'trafimage-maps/es/layers/TrafimageMapboxLayer';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;

const topic = {
  name: 'Default',
  key: 'default',
  elements: {
    menu: false,
    header: true,
    footer: true,
    permalink: false,
  },
  layers: [
    new TrafimageMapboxLayer({
      name: 'Netzkarte',
      visible: true,
      style: 'base_bright_v2',
    }),
  ],
};

const App = () => {
  const ref = useRef();

  useEffect(() => {
    const map = ref.current;
    map.topics = [topic];

    return () => {
      map.topics = null;
    };
  }, []);

  return (
    <div className="container">
      <trafimage-maps ref={ref} zoom="7" apiKey={apiKey} />
    </div>
  );
};

<App />;
```
