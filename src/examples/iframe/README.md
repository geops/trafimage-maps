The _trafimage-maps_ web component can be embedded as an iframe on any website. Web component properties can be set via the iframe source url.

```jsx
import React, { useMemo, useState } from 'react';
import Editor from 'react-styleguidist/lib/client/rsg-components/Editor';
import Heading from 'react-styleguidist/lib/client/rsg-components/Heading';
import DocForm from '../DocForm';
import getIframeCodeFromUrl from './getIframeCodeFromUrl';
import getHtmlPageCode from './getHtmlPageCode';
import iframeSearchParams from './iframeSearchParams';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;
const baseUrl = 'https://trafimage-maps.sbb.ch';
const topic = '';

const App = () => {
  const [url, setUrl] = useState(baseUrl + '/' + topic);
  const code = useMemo(() => {
    return getHtmlPageCode(getIframeCodeFromUrl(url));
  }, [url]);

  return (
    <>
      <div className="container">
        <iframe src={url} />
      </div>
      <br />
      <Editor
        code={code}
        onChange={(code) => null} //setCode(code)}
      />
      <br />
      <DocForm
        value={url}
        onChange={(newUrl) => {
          setUrl(newUrl);
        }}
        isIframe
        propConfig={iframeSearchParams}
      />
    </>
  );
};

<App />;
```
