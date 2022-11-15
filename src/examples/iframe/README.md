The web component is used as basis for the application [maps.trafimage.ch](https://map.trafimage.ch).

If you wish you can use the official website inside an iframe, you have access to the same functionnalities.


```jsx
import React, { useMemo, useState,useEffect} from 'react';
import { TextField, FormControl, Select, InputLabel,MenuItem} from '@material-ui/core'
import IframeDoc from './IframeDoc';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;
const baseUrl = 'https://maps.trafimage.ch';
const topic = '';

const App = () => {
  const [url, setUrl] = useState(baseUrl + '/' + topic);

  return (
    <>
      <IframeDoc value={url} onChange={(newUrl)=> {
        setUrl(newUrl);
      }}/>
      <TextField label="Iframe URL" variant="outlined" value={url} margin="normal" fullWidth onChange={(evt) => {
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
