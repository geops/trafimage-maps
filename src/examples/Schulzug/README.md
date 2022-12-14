This example shows how to create a simple map with vector data.

```jsx
import 'trafimage-maps';
import React, { useRef, useEffect } from 'react';
import TrafimageMapboxLayer from 'trafimage-maps/es/layers/TrafimageMapboxLayer';
import { VectorLayer } from 'mobility-toolbox-js/ol';
import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Icon, Style } from 'ol/style';
import marker from './marker.png';

const featureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      id: '1',
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [8.309307, 47.0501683],
      },
      properties: {
        title: 'feature 1',
        inactive: true,
      },
    },
    {
      id: '2',
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [8.657227, 47.023334],
      },
      properties: {
        title: 'feature 2',
        inactive: false,
      },
    },
  ],
};
const format = new GeoJSON({
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857',
});

const topic = {
  name: 'Default',
  key: 'default',
  elements: {
    menu: false,
    header: false,
    footer: false,
    permalink: false,
  },
  layers: [
    new TrafimageMapboxLayer({
      style: 'base_bright_v2',
    }),
    new VectorLayer({
      olLayer: new OLVectorLayer({
        style: [
          new Style({
            image: new Icon({ src: marker, scale: 0.5 }),
          }),
        ],
        source: new VectorSource({
          features: format.readFeatures(featureCollection),
        }),
      }),
      onClick: ([feature]) => {
        if (feature) {
          alert(feature.get('title'));
        }
      },
    }),
  ],
};

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;

const App = () => {
  const ref = useRef();

  useEffect(() => {
    const map = ref.current;
    map.topics = [topic];

    return () => {
      map.topics = null;
    };
  }, []);

  return (
    <div className="container">
      <trafimage-maps ref={ref} zoom="7" apiKey={apiKey} />
    </div>
  );
};

<App />;
```
