import { transform as transformCoords } from 'ol/proj';
import React from 'react';

import { setCenter, setZoom } from '../../model/map/actions';
import Search from '../Search';

class StationFinder extends Search {
  constructor() {
    super();
    this.key = '5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93';
  }

  search(value) {
    return fetch(`https://api.geops.io/stops/v1/?&q=${value}&key=${this.key}`)
      .then(data => data.json())
      .then(featureCollection => featureCollection.features);
  }

  render(item) {
    return <div>{item.properties.name}</div>;
  }

  select(item) {
    this.dispatch(setZoom(12));
    this.dispatch(
      setCenter(
        transformCoords(item.geometry.coordinates, 'EPSG:4326', 'EPSG:3857'),
      ),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.properties.name;
  }
}

export default StationFinder;
