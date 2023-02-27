Example how to create your own topic.

```jsx
import 'trafimage-maps';
import React, { useRef, useEffect, useState } from 'react';
import TrafimageMapboxLayer from 'trafimage-maps/es/layers/TrafimageMapboxLayer';
import Editor from 'react-styleguidist/lib/client/rsg-components/Editor';
import getCodeWithParsedApiKey from '../getCodeWithParsedApiKey.js';
import EditorCode from './ExampleCode.txt';

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
  const [code, setCode] = useState();

  useEffect(() => {
    const map = ref.current;
    map.topics = [topic];

    // We fetch the example code from local text file and insert the current public API key
    const getCode = async () => {
      const jsCode = await getCodeWithParsedApiKey(
        `./${EditorCode}`,
        window.apiKey,
      );
      setCode(jsCode);
    };
    getCode();

    return () => {
      map.topics = null;
    };
  }, []);

  return (
    <>
      <div className="container">
        <trafimage-maps ref={ref} zoom="7" apiKey={apiKey} />
      </div>
      <br />
      {code && <Editor code={code} onChange={(code) => null} />}
    </>
  );
};

<App />;
```
