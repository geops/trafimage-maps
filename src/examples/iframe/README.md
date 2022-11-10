The web component is used as basis for the application [maps.trafimage.ch](https://map.trafimage.ch).

If you wish you can use the official website inside an iframe, you have access to the same functionnalities.


```jsx
import React, { useMemo, useState} from 'react';
import { TextField } from '@material-ui/core'

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;
const baseUrl = 'https://maps.trafimage.ch';
const topic = 'ch.sbb.construction';

const App = () => {
  const [url, setUrl] = useState(baseUrl + '/' + topic);

  return (
    <>
      <TextField label="Iframe URL" variant="outlined" defaultValue={url} margin="normal" fullWidth onChange={(evt) => {
          setUrl(evt.target.value);
      }}/>
      <div className="container">
        <iframe src={url}/>
      </div>
    </>
  );
}

<App />
```
