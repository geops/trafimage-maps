Example for the _Operating regions_ topic.

```js
import 'trafimage-maps';
import Editor from 'react-styleguidist/lib/client/rsg-components/Editor';
import getHtmlPageCode from '../getHtmlPageCode';

const App = () => {
  return (
    <>
      <div className="container">
        <trafimage-maps
          appName="betriebsregionen"
          apiKey={apiKey}
          width="100%"
          height="500px"
        />
      </div>
      <br />
      <Editor
        code={getHtmlPageCode(
          `<!--Please contact sbb_map@geops.ch for your own API key-->\n      <trafimage-maps\n\tappName="betriebsregionen"\n\tapiKey="${window.apiKey}"\n\theight="500px"\n      />`,
        )}
        onChange={(code) => null} //setCode(code)}
      />
    </>
  );
};
<App />;
```
