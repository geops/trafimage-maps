Simple and flexible configuration of a trafimage maps application. You can use prepared map topics or integrate any [layers](https://jsdoc.maps.trafimage.ch/docjs.html).

Trafimage maps are used to illustrate a whole range of topics relating to public transport ([more information](https://company.sbb.ch/en/sbb-as-business-partner/services/trafimage-maps-and-station-plans.html)).
This section shows you how to configure your own map for integrating it in your existing web page.

```
import 'trafimage-maps';
import React, { useState, useMemo } from 'react';
import Editor from 'react-styleguidist/lib/client/rsg-components/Editor';
import getHtmlPageCode from './getHtmlPageCode';
import DocForm from '../DocForm';
import getWcCodeFromUrl from './getWcCodeFromUrl';
import getWcAttributesFromUrl from './getWcAttributesFromUrl';
import webComponentAttributes from './webComponentAttributes';

const apiKey = window.apiKey;

const App = () => {
  const [url, setUrl] = useState('https://maps.trafimage.ch');

  const code = useMemo(() => {
    return getHtmlPageCode(getWcCodeFromUrl(url));
  }, [url]);

  const props = useMemo(() => {
    return getWcAttributesFromUrl(url, false);
  }, [url]);

  const webComponent = useMemo(() => {
    return (
      <trafimage-maps zoom="7" apiKey={apiKey} embedded="true" {...props} />
    );
  }, [props]);

  return (
    <>
      <DocForm
        value={url}
        onChange={(newUrl) => {
          setUrl(newUrl);
        }}
        propConfig={webComponentAttributes}
      />
      <div className="container">{webComponent}</div>
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
