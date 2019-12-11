#

Trafimage maps are used to illustrate a whole range of topics relating to public transport ([more information](https://www.sbb.ch/en/bahnhof-services/bahnhoefe/karten-bahnhofplaene/trafimage-karten.html)).
This section shows you how to configure your own map for integrating it in your existing web page.

```jsx
import 'trafimage-maps';
import React, { useRef, useEffect } from 'react';
import topic from 'trafimage-maps/examples/WebComponent/topic';

const App = () => {
  const ref = useRef();

  useEffect(() => {
    const map = ref.current;
    map.topics =  [topic];

    return () => {
      map.topics = null;
    };
  }, []);

  return (
    <div className="container">
      <trafimage-maps ref={ref} zoom="7"/>
    </div>
  );
}

<App />
```
