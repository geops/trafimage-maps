This example shows how to integrate punctuality information in your map application.

The vehicles displayed can be filtered using layer's properties, see 'view code' section for an example of use.

The vehicles displayed can also be filtered using url parameters:

- publishedlinename : a comma separated list of line's name (ex: [publishedlinename=RE,IC5,S3,17](/?publishedlinename=RE,IC5,S3,17#/Examples/Punctuality%20Map))
- tripnumber : a comma separated list of trip's number (ex: [tripnumber=007383.003849.001:3](/?tripnumber=007383.003849.001:3#/Examples/Punctuality%20Map))

Important to know, filters using layer's properties have precedence over url parameters.

```jsx
import 'trafimage-maps';
import React, { useRef, useEffect, useState } from 'react';
import TralisLayer from 'trafimage-maps/es/layers/TralisLayer';
import TrafimageMapboxLayer from 'trafimage-maps/es/layers/TrafimageMapboxLayer';
import Editor from 'react-styleguidist/lib/client/rsg-components/Editor';
import getCodeWithApiKey from '../getCodeWithApiKey.js';
import EditorCode from './ExampleCode.txt';

const apiKey = window.apiKey;

const App = () => {
  const ref = useRef();
  const [code, setCode] = useState();

  useEffect(() => {
    const map = ref.current;
    map.topics = [
      {
        name: 'Punctuality topic',
        key: 'punctuality',
        layers: [
          new TrafimageMapboxLayer({
            name: 'Background layer',
            style: 'base_bright_v2',
          }),
          new TralisLayer({
            name: 'Punctuality Layer',
            apiKey: apiKey,
            onClick: (features) => {
              // Show the raw features clicked in the browser console (press F12).
              console.log(features);
            },
            // You can filter the trains displayed using the following properties:
            // tripNumber: '007383.003849.001:3',
            // publishedLineName: 'RE,IC5,S3,17',
            // regexPublishedLineName: '^S[0-5]$'
          }),
        ],
        elements: {
          footer: true,
          header: true,
          mapControls: true,
          menu: true,
          popup: true,
          permalink: false,
          search: false,
          trackerMenu: true,
        },
      },
    ];

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
        <trafimage-maps
          ref={ref}
          zoom="14"
          center="[950690,6004000]"
          apiKey={apiKey}
        />
      </div>
      <br />
      {code && <Editor code={code} onChange={(code) => null} />}
    </>
  );
};

<App />;
```
