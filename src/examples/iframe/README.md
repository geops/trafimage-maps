The _trafimage-maps_ web component can be embedded as an iframe on any website. Web component properties can be set via the iframe source url.

```jsx
import React, { useMemo, useState } from 'react';
import Editor from 'react-styleguidist/lib/client/rsg-components/Editor';
import Heading from 'react-styleguidist/lib/client/rsg-components/Heading';
import DocForm from 'trafimage-maps/es/examples/DocForm';
import getIframeCodeFromUrl from 'trafimage-maps/es/examples/iframe/getIframeCodeFromUrl';
import getHtmlPageCode from 'trafimage-maps/es/examples/iframe/getHtmlPageCode';
import iframeSearchParams from 'trafimage-maps/es/examples/iframe/iframeSearchParams';

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
