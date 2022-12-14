Example how to override an existing topic.

```jsx
import 'trafimage-maps';
import React, { useRef, useEffect } from 'react';
import { netzkarte } from 'trafimage-maps/es/config/topics';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;

const topic = {
  ...netzkarte,
  elements: {
    ...netzkarte.elements,
    popup: false,
  },
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
