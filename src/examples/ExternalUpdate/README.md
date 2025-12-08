The _trafimage-maps_ web component can be manipulated externally by setting and changing its attributes.
This example shows how to control the map zoom level from a button outside the web component.

```js
import "trafimage-maps";
import Editor from "react-styleguidist/lib/client/rsg-components/Editor";
import { Button } from "@mui/material";
import getHtmlPageCode from "../getHtmlPageCode";

const changeAttr = async function (attr, val) {
  var map = document.getElementById("map");
  // If attribute value is the same the update is not triggered,
  // so we set it to null first before setting it to the new value.
  if (!val) {
    map.removeAttribute(attr);
  }
  if (!!map.getAttribute(attr.toLowerCase())) {
    await changeAttr(attr.toLowerCase(), null);
  }
  map.setAttribute(attr.toLowerCase(), val);
};

const App = () => {
  return (
    <>
      <div className="container">
        <trafimage-maps
          id="map"
          apiKey={apiKey}
          height="500px"
          elements="permalink=false"
          zoom="10"
        />
        <br />
        <button
          onClick={() => changeAttr("zoom", 16)}
          style={{ height: 40, cursor: "pointer" }}
        >
          Change zoom to 16
        </button>
      </div>
      <br />
      <br />
      <br />
      <Editor
        code={getHtmlPageCode(
          `<!--Please contact sbb_map@geops.ch for your own API key-->\n      <trafimage-maps\n\tid="map"\n\telements="permalink=false"\n\tapiKey="${window.apiKey}"\n      />\n      <button\r\n\tonClick=\"changeAttr('zoom', 16)\"\r\n\tstyle="height: 40px; cursor: pointer;"\r\n      >\r\n\tChange zoom to 16\r\n      </button>`,
          "<script type=\"text/javascript\">\n\twindow.changeAttr = async function (attr, val) {\r\n\t  var map = document.getElementById('map');\r\n\t  // Trigger update by setting attribute to null, then to the new value\r\n\t  if (!val) {\r\n\t    map.removeAttribute(attr);\r\n\t  }\r\n\t  if (!!map.getAttribute(attr.toLowerCase())) {\r\n\t    await changeAttr(attr.toLowerCase(), null);\r\n\t  }\r\n\t  map.setAttribute(attr.toLowerCase(), val);\r\n\t}\n   </script>",
        )}
        onChange={(code) => null}
      />
    </>
  );
};
<App />;
```
