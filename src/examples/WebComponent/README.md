[Trafimage maps](https://company.sbb.ch/en/sbb-as-business-partner/services/trafimage-maps-and-station-plans.html) focus on public transport in Switzerland and Europe. The maps combine high graphical quality with a consistent network data model, that allows to depict many thematic aspects upon them.

_trafimage-maps_ stands for a web component, that encapsulates all UI elements of the [Trafimage web mapping portal](https://maps.trafimage.ch/). It allows to use readily prepared map topics as well as single map [layers](/docjs.html) in order to create own topics. The main adavantage of a web component is its modularity and reusability. The _trafimage-maps_ web component can be used across different web projects with either Vanilla JavaScript, various JavaScript frameworks or wrapped within an iframe.

The main mapping libraries in _trafimage-maps_ are [OpenLayers](https://openlayers.org/) and [MapLibre GL JS](https://maplibre.org/projects/maplibre-gl-js/). Furthermore, some topics and components also use [mobility-toolbox-js](https://mobility-toolbox-js.geops.io/) and [react-spatial](https://react-spatial.geops.io).

The whole code of _trafimage-maps_ is open source and can be found on [GitHub](https://github.com/geops/trafimage-maps).

This section shows you how to configure your own basic map for integrating it in your existing web page. Under [Examples](/#/Examples/HTML%20%26%20Vanilla%20JS/Construction) you can find samples as well as code generators for different environments.

```jsx
import "trafimage-maps";
import React, { useState, useMemo } from "react";
import Editor from "react-styleguidist/lib/client/rsg-components/Editor";
import getHtmlPageCode from "../getHtmlPageCode";
import DocForm from "../DocForm";
import getWcCodeFromUrl from "./getWcCodeFromUrl";
import getWcAttributesFromUrl from "./getWcAttributesFromUrl";
import webComponentAttributes from "./webComponentAttributes";

const apiKey = window.apiKey;

const App = () => {
  const [url, setUrl] = useState("https://maps.trafimage.ch");
  const code = useMemo(() => {
    return getHtmlPageCode(getWcCodeFromUrl(url));
  }, [url]);
  const props = useMemo(() => {
    return getWcAttributesFromUrl(url, false);
  }, [url]);

  return (
    <>
      <div className="container">
        <trafimage-maps
          zoom="7"
          apiKey={apiKey}
          embedded="true"
          {...props}
          width="100%"
          height="500px"
        />
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
        propConfig={webComponentAttributes}
      />
    </>
  );
};

<App />;
```
