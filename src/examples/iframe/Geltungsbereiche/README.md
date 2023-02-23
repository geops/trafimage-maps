The Geltungsbereiche topic provides a topic specifically for iframe use.

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
import DocForm from '../../DocForm';
import getIframeCodeFromUrl from '../getIframeCodeFromUrl';
import getHtmlPageCode from '../getHtmlPageCode';
import iframeSearchParams from '../iframeSearchParams';
// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;
const baseUrl = 'https://maps.trafimage.ch';
const topic = 'ch.sbb.geltungsbereiche-iframe';

const App = () => {
  const [url, setUrl] = useState(baseUrl + '/' + topic + '?embedded=true');

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
        propToggler={false}
        propConfig={iframeSearchParams}
        filter={(config) => ['layers', 'embedded'].includes(config.name)}
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
