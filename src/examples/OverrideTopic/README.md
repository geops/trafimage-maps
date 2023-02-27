Example how to override an existing topic.

```jsx
import 'trafimage-maps';
import React, { useRef, useEffect, useState } from 'react';
import Editor from 'react-styleguidist/lib/client/rsg-components/Editor';
import { netzkarte } from 'trafimage-maps/es/config/topics';
import getCodeWithApiKey from '../getCodeWithApiKey.js';
import EditorCode from './ExampleCode.txt';

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
  const [code, setCode] = useState();
  useEffect(() => {
    const map = ref.current;
    map.topics = [topic];

    // We fetch the example code from local text file and insert the current public API key
    const getCode = async () => {
      const jsCode = await getCodeWithApiKey(`./${EditorCode}`, window.apiKey);
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
