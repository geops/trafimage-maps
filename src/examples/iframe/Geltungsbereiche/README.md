The _Geltungsbereiche_ topic provides a topic specifically for iframe use.

```jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Editor from "react-styleguidist/lib/client/rsg-components/Editor";
import Heading from "react-styleguidist/lib/client/rsg-components/Heading";
import DocForm from "../../DocForm";
import getIframeCodeFromUrl from "../getIframeCodeFromUrl";
import getHtmlPageCode from "../getHtmlPageCode";
import iframeSearchParams from "../iframeSearchParams";
// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;
const baseUrl = "https://trafimage-maps.sbb.ch";
const topic = "ch.sbb.geltungsbereiche-iframe";

const App = () => {
  const [url, setUrl] = useState(baseUrl + "/" + topic + "?embedded=true");

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
        filter={(config) => ["layers", "embedded"].includes(config.name)}
      />
    </>
  );
};

<App />;
```
