This example shows how to show the _Area of validity_ topic optimized for small screen.

```js
import "trafimage-maps";
import Editor from "react-styleguidist/lib/client/rsg-components/Editor";
import getHtmlPageCode from "../getHtmlPageCode";

const App = () => {
  return (
    <>
      <div className="container">
        <trafimage-maps
          apiKey={apiKey}
          activeTopicKey="ch.sbb.geltungsbereiche-iframe"
          height="500px"
          zoom="7"
          language="en"
          elements="permalink=false"
          embedded="true"
        />
        ;
      </div>
      <br />
      <Editor
        code={getHtmlPageCode(
          `<!--Please contact sbb_map@geops.ch for your own API key-->\n      <trafimage-maps\n\tactiveTopicKey="ch.sbb.geltungsbereiche-iframe"\n\tapiKey="${window.apiKey}"\n\tzoom="7"\n\telements="permalink=false"\n\tembedded="true"\n\tlanguage="en"\n      />`,
        )}
        onChange={(code) => null} //setCode(code)}
      />
    </>
  );
};
<App />;
```
