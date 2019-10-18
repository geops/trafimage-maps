import React from 'react';

import Search from '../Search';

class Lines extends Search {
  constructor() {
    super();
    this.dataProjection = 'EPSG:21781';
  }

  // eslint-disable-next-line class-methods-use-this
  search(value) {
    return fetch(`https://maps.trafimage.ch/search/lines?line=${value}`)
      .then(data => data.json())
      .then(featureCollection => featureCollection.features);
  }

  render(item) {
    return <div>{item.properties.name}</div>;
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.properties.name;
  }
}

export default Lines;
