#

Trafimage maps are used to illustrate a whole range of topics relating to public transport ([more information](https://www.sbb.ch/en/bahnhof-services/bahnhoefe/karten-bahnhofplaene/trafimage-karten.html)).
This section shows you how to configure your own map for integrating it in your existing web page.

```jsx
import 'trafimage-maps';
import React, { useEffect } from 'react';
import topic from 'trafimage-maps/examples/WebComponent/topic';

const App = () => {
  useEffect(() => {
    const trafimage = document.getElementById('map');
    trafimage.topics =  [topic];
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: 500 }}>
      <trafimage-maps id="map"/>
    </div>
  );
}

<App />
```
