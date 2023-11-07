The _Railplus_ topic provides a topic specifically for iframe use.

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
import iframeSearcgetHtmlPageCodehParams from '../iframeSearchParams';
import { PDF_DOWNLOAD_EVENT_TYPE } from '../../../utils/constants';
// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;
const baseUrl = 'https://maps.trafimage.ch';
const topic = 'ch.railplus.mitglieder';

const extraCode = `
    <button onclick="downloadPdf()" style="margin: 10px 5px; padding: 10px 5px">Export PDF</button>
    <script>
      function downloadPdf() {
        const iframe = document.getElementsByTagName('iframe');
        if (iframe) {
          iframe.contentWindow.postMessage('${PDF_DOWNLOAD_EVENT_TYPE}', '*');
        }
      }
    </script>`;

const App = () => {
  const [url, setUrl] = useState(baseUrl + '/' + topic);
  const code = getHtmlPageCode(
    getIframeCodeFromUrl(`${url}?lang=de`),
    extraCode,
  );

  return (
    <>
      <div className="container">
        <iframe src={url} id="railplus-iframe" />
      </div>
      <button
        style={{ margin: '10px 5px', padding: '10px 5px' }}
        onClick={() => {
          const iframe = document.getElementById('railplus-iframe');
          if (iframe) {
            iframe.contentWindow.postMessage(PDF_DOWNLOAD_EVENT_TYPE, '*');
          }
        }}
      >
        Export PDF
      </button>
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
