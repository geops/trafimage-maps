#

This demonstrates the use of Map.

```jsx
import React from 'react';
import { Provider } from 'react-redux';
import OLMap from 'ol/Map';
import ConfigReader from 'react-spatial/ConfigReader';
import LayerService from 'react-spatial/LayerService';
import BasicMap from 'react-spatial/components/BasicMap';
import LAYER_CONF from '../../appConfig/layers';
import { getStore } from '../../model/store';

const map = new OLMap({ controls: [] });
const layerService = new LayerService([
  ...ConfigReader.readConfig(map, LAYER_CONF),
]);

function MapExample() {
  return (
    <div className="tm-map-example">
      <Provider store={getStore()}>
        <BasicMap
          map={map}
          layers={layerService.getLayers()}
          center={[922748, 5911640]}
          zoom={9}
        />
      </Provider>
    </div>
  );
}

<MapExample />;
```
