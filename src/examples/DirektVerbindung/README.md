Example how to display only the night connections layer.

To display the day connection just change the layersVisibility parameter to:

layersVisibility="ch.sbb.direktverbindungen.day=true"

```js
import "trafimage-maps";
import Editor from "react-styleguidist/lib/client/rsg-components/Editor";
import getHtmlPageCode from "../getHtmlPageCode";

const App = () => {
  return (
    <>
      <div className="container">
        <trafimage-maps
          activeTopicKey="ch.sbb.direktverbindungen"
          apiKey={apiKey}
          height="500px"
          zoom="6"
          language="en"
          elements="permalink=false,search=false"
          layersVisibility="ch.sbb.direktverbindungen.day=false"
        />
      </div>
      <br />
      <Editor
        code={getHtmlPageCode(
          `<!--Please contact sbb_map@geops.ch for your own API key-->\n      <trafimage-maps\n\tactiveTopicKey="ch.sbb.netzkarte"\n\tapiKey="${window.apiKey}"\n\tzoom="6"\n\telements="menu=false,header=false,permalink=false,search=false"\n\tembedded="true"\n\tlanguage="en"\n\tlayersVisibility="ch.sbb.direktverbindungen.day=false"\n      />`,
        )}
        onChange={(code) => null} //setCode(code)}
      />
    </>
  );
};
<App />;
```
