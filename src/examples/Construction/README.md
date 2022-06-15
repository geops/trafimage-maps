Example how to load 'trafimage-maps' with a specific topic without using React.

```js
import 'trafimage-maps';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;

<trafimage-maps
  activeTopicKey="ch.sbb.construction"
  apiKey={apiKey}
  height="500px"
  language="en"
/>;
```
