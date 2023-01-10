Example how to display only the night connections layer.

To display the day connection just change the layersVisibility parameter to:

layersVisibility="ch.sbb.direktverbindungen.day=true"

```js
import 'trafimage-maps';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;

<trafimage-maps
  activeTopicKey="ch.sbb.netzkarte"
  apiKey={apiKey}
  height="500px"
  zoom="6"
  language="en"
  elements="menu=false,header=false,permalink=false,search=false"
  // Just change the layersVisibility parameter to be able to see day connection:
  // "ch.sbb.direktverbindungen.day=true"
  layersVisibility="ch.sbb.direktverbindungen.night=true"
/>;
```
