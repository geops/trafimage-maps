The web component is used as basis for the application [maps.trafimage.ch](https://map.trafimage.ch).

If you wish you can use the official website inside an iframe, you have access to the same functionnalities.

```jsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@material-ui/core';
import Editor from 'react-styleguidist/lib/client/rsg-components/Editor';
import Heading from 'react-styleguidist/lib/client/rsg-components/Heading';
import DocForm from '../DocForm';
import getIframeCodeFromUrl from './getIframeCodeFromUrl';
import getHtmlPageCode from './getHtmlPageCode';
import iframeSearchParams from './iframeSearchParams';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;
const baseUrl = 'https://maps.trafimage.ch';
const topic = '';

const App = () => {
  const [url, setUrl] = useState(baseUrl + '/' + topic);

  const code = useMemo(() => {
    return getHtmlPageCode(getIframeCodeFromUrl(url));
  }, [url]);

  return (
    <>
      <DocForm
        value={url}
        onChange={(newUrl) => {
          setUrl(newUrl);
        }}
        isIframe
        propConfig={iframeSearchParams}
      />
      <div className="container">
        <iframe src={url} />
      </div>
      <br />
      <Editor
        code={code}
        onChange={(code) => null} //setCode(code)}
      />
    </>
  );
};

<App />;
```
