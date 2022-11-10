The Geltungsbereiche topic provides a topic specific for iframe use.

```jsx
import React, { useMemo } from 'react';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;

const App = () => {

  const url = 'https://maps.trafimage.ch/ch.geltungs.bereiche-iframe';

  return (
    <div className="container">
      <input type="text" value={url}></input>
      <iframe href={url}  width="550" height="300"/>
    </div>
  );
}

<App />
```
