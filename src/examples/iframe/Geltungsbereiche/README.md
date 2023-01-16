The Geltungsbereiche topic provides a topic specific for iframe use.

```jsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@material-ui/core';
import IframeDoc from '../IframeDoc';
import getCodeFromUrl from '../getCodeFromUrl';
import Editor from 'react-styleguidist/lib/client/rsg-components/Editor';
import Heading from 'react-styleguidist/lib/client/rsg-components/Heading';
// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;
const baseUrl = 'https://maps.trafimage.ch';
const topic = 'ch.sbb.geltungsbereiche-iframe';


const App = () => {
  const [url, setUrl] = useState(baseUrl + '/' + topic);

  const code = useMemo(() => {
    return getCodeFromUrl(url);
  }, [url]);

  return (
    <>
      <IframeDoc
        value={url}
        onChange={(newUrl) => {
          setUrl(newUrl);
        }}

        // Filter the parameter to display
        filter={(config) => ['layers','embedded'].includes(config.name)}
      />
      <TextField
        label="Iframe URL"
        variant="outlined"
        value={url}
        margin="normal"
        fullWidth
        onChange={(evt) => {
          setUrl(evt.target.value);
        }}
      />
      <div className="container">
        <iframe src={url} />
      </div>
      <br />
      <br />
      <div>
        <Heading level={2}>Web component code: </Heading>
        <br />
        <Editor
          code={code}
          onChange={(code) => null} //setCode(code)}
        />
      </div>
    </>
  );
};

<App />;
```
