import React from 'react';

import Search from '../Search';

const endpoint = 'https://api.geops.io/stops/v1/';

class StopFinder extends Search {
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  search(value) {
    return fetch(`${endpoint}?&q=${value}&key=${this.apiKey}`)
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
