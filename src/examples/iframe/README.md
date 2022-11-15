The web component is used as basis for the application [maps.trafimage.ch](https://map.trafimage.ch).

If you wish you can use the official website inside an iframe, you have access to the same functionnalities.


```jsx
import React, { useMemo, useState,useEffect} from 'react';
import { TextField, FormControl, Select, InputLabel,MenuItem} from '@material-ui/core'
import IframeDoc from './IframeDoc';
import Editor from 'react-styleguidist/lib/client/rsg-components/Editor';
import Heading from 'react-styleguidist/lib/client/rsg-components/Heading';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;
const baseUrl = 'https://maps.trafimage.ch';
const topic = '';

const getCodeFromUrl = (urlString) => {
  if (!urlString) {
    return null;
  }
  const url = new URL(urlString);
  const {pathname,searchParams} = url;
  const code = [];
  code.push("<trafimage-maps ");
  code.push(`\n\tapiKey="${window.apiKey}"`);


  // activeTopicKey
  let activeTopicKey = (pathname && pathname.split('/')[1]) || null;
  if (activeTopicKey) {
    code.push(`\n\tactiveTopicKey="${activeTopicKey}"`)
  }

  // baselayers 
  let layersVisibility = '';
  // TODO see why it does not work, conflict with permalink maybe?
  // layersVisibility doesn't affect the visibility of base layer.
  // let baselayers = searchParams.get('baselayers');
  // if (baselayers) {
  //   // only the first is relevant
  //   layersVisibility = `${baselayers.split(',')[0]}=true`;
  // }

  // layers
  let layers = searchParams.get('layers');
  if (layers) {
    if(layersVisibility){
      layersVisibility += ',';
    }
    layersVisibility += layers.split(',').map(d => `${d}=true`).join(',');
  }
  
  // baselayers & layers
  if (layersVisibility) {
    code.push(`\n\tlayersVisibility="${layersVisibility}"`);
  }

  // disabled
  let disabled = searchParams.get('disabled');
  if (disabled) {
    code.push(`\n\telements="${disabled.split(',').map(d => `${d}=false`).join(',')}"`)
  }

  // language
  let language = searchParams.get('lang');
  if (language) {
    code.push(`\n\tlanguage="${language}"`)
  }

  // center
  let x = searchParams.get('x');
  let y = searchParams.get('y');
  if (x&& y) {
    code.push(`\n\tcenter="${x},${y}"`)
  }

  // zoom
  let z = searchParams.get('z');
  if (z) {
    code.push(`\n\tzoom="${z}"`)
  }

  // embedded
  let embedded = searchParams.get('embedded');
  if (embedded === 'true') {
    code.push(`\n\tembedded="${embedded}"`)
  }

  code.push("/>");
  return code.join("");
}

const App = () => {
  const [url, setUrl] = useState(baseUrl + '/' + topic);

  const code = useMemo(()=> {
    return getCodeFromUrl(url);
  }, [url])

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
      <br/>
      <br/>
      <div>
        <Heading level={2}>Web component code: </Heading>
      <br/>
        <Editor
          code={code}
          onChange={code => null}//setCode(code)}
        />
      </div>
    </>
  );
}

<App />
```
