#

Example how to load 'trafimage-maps' with a specific topic without using React.

```js
import 'trafimage-maps';
import Layer from 'react-spatial/layers/Layer';
import TrajservLayer from 'react-transit/layers/TrajservLayer';

<trafimage-maps
  activeTopicKey="ch.sbb.construction"
  apiKey="5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93"
  height="500px"
  language="en"
/>
```
