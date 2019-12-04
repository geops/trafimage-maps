#

Simple and flexible configuration of a trafimage maps application.
You can use prepared map topics or integrate any [layers](/docjs.html).

```jsx
import 'trafimage-maps';
import React, { useEffect, useRef } from 'react';
import topic from 'trafimage-maps/examples/WebComponent/topic';

const App = () => {
  const ref = useRef();

  useEffect(() => {
    const map = ref.current;
    map.topics =  [{...topic, layers: [...topic.layers]}];
  }, []);

  return (
    <div className="container">
      <trafimage-maps ref={ref} />
    </div>
  );
}

<App />
```