#

Example how to load 'trafimage-maps' with a specific topic without using React.

The used `apiKey` is a demo key. Please [request your own api key](http://developer.geops.io/) for using the application.

```js
import 'trafimage-maps';

// The used `apiKey` is a demo key. Please [request your own api key](http://developer.geops.io/) for using the application.
const apiKey = window.apiKey;

<trafimage-maps
  activeTopicKey="ch.sbb.construction"
  apiKey={apiKey}
  height="500px"
  language="en"
/>
```
