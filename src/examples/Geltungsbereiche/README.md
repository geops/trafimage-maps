This example shows how to show the Geltungsbereiche topic optimized for small screen.

```jsx
import 'trafimage-maps';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;

<trafimage-maps
  apiKey={apiKey}
  activeTopicKey="ch.sbb.geltungsbereiche-iframe"
  height="500px"
  zoom="7"
  language="en"
  elements="permalink=false"
  embedded="true"
/>;
```
