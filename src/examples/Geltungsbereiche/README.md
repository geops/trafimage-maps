
This example shows how to show the Geltungsbereiche topic optimized for small screen.

```jsx
import 'trafimage-maps';
import React, { useRef, useEffect } from 'react';
import { geltungsbereicheMvp } from 'trafimage-maps/es/config/topics';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;

const App = () => {
  const ref = useRef();

  useEffect(() => {
    const map = ref.current;
    map.topics =  [geltungsbereicheMvp];

    return () => {
      map.topics = null;
    };
  }, []);

  return (
    <div className="container">
      <trafimage-maps ref={ref}
        id="tm"
        topics="[]"
        apiKey={apiKey}
        height="500px"
        zoom="7"
        language="en"
        elements="header=false,footer=false,geolocationButton=false,permalink=false,search=false,drawMenu=false,shareMenu=false" 
      />
    </div>
  );
}

<App />
```
