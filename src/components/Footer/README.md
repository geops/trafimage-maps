#

This demonstrates the use of Footer.

```jsx
import React from 'react';
import { Provider } from 'react-redux'
import { getStore } from '../../model/store';
import OLMap from 'ol/Map';
import LayerService from 'react-spatial/LayerService';
import Footer from 'trafimage-maps/components/Footer';

const layerService = new LayerService([]);
const map = new OLMap({});

function FooterExample() {
  return (
    <div className="tm-footer-example">
      <Provider store={getStore()}>
        <Footer layerService={layerService} map={map} />
      </Provider>
    </div>
  );
}

<FooterExample />;
```
