The Geltungsbereiche topic provides a topic specific for iframe use.

```jsx
import React, { useMemo, useState } from 'react';
import { TextField } from '@material-ui/core';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;
const baseUrl =
  'https://dev-trafimage-maps-git-daniel-geltungsbereiche-geops.vercel.app';
const topic = '/ch.sbb.geltungsbereiche-iframe';
const params = '?embedded=true';

const App = () => {
  const [url, setUrl] = useState(baseUrl + topic + params);

  return (
    <>
      <TextField
        label="Iframe URL"
        variant="outlined"
        defaultValue={url}
        margin="normal"
        fullWidth
        onChange={(evt) => {
          setUrl(evt.target.value);
        }}
      />
      <div className="container">
        <iframe src={url} />
      </div>
    </>
  );
};

<App />;
```
