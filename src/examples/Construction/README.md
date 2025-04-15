Example how to load _trafimage-maps_ with a specific topic without using React.

```js
import "trafimage-maps";
import Editor from "react-styleguidist/lib/client/rsg-components/Editor";
import getHtmlPageCode from "../getHtmlPageCode";

const App = () => {
  return (
    <>
      <div className="container">
        <trafimage-maps
          activeTopicKey="ch.sbb.construction"
          apiKey={apiKey}
          height="500px"
          language="en"
        />
      </div>
      <br />
      <Editor
        code={getHtmlPageCode(
          `<!--Please contact sbb_map@geops.ch for your own API key-->\n      <trafimage-maps\n\tactiveTopicKey="ch.sbb.construction"\n\tapiKey="${window.apiKey}"\n\tlanguage="en"\n      />`,
        )}
        onChange={(code) => null} //setCode(code)}
      />
    </>
  );
};
<App />;
```
