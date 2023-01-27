Trafimage maps are used to illustrate a whole range of topics relating to public transport ([more information](https://company.sbb.ch/en/sbb-as-business-partner/services/trafimage-maps-and-station-plans.html)).
This section shows you how to configure your own map for integrating it in your existing web page.

```jsx
import 'trafimage-maps';
import React from 'react';
import Editor from 'react-styleguidist/lib/client/rsg-components/Editor';
import getHtmlPageCode from './examples/getHtmlPageCode';

const App = () => {
  return (
    <div className="container">
      <trafimage-maps
        zoom="7"
        apiKey={apiKey}
        embedded="true"
        elements="permalink=false"
      />
      <br/>
      <Editor
        code={getHtmlPageCode(`<trafimage-maps\n        zoom="7"\n        apiKey="${apiKey}"\n        embedded="true"\n        elements="permalink=false"\n      />`)}
        onChange={(code) => null} //setCode(code)}
      />
    </div>
  );
};

<App />;
```
