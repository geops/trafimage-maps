import React from 'react';

import Search from '../Search';

class StopFinder extends Search {
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

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.properties.name;
  }
}

export default StopFinder;
