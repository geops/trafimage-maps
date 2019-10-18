import React from 'react';

import Search from '../Search';

class Betriebspunkte extends Search {
  constructor() {
    super();
    this.showInPlaceholder = false;
    this.dataProjection = 'EPSG:21781';
  }

  // eslint-disable-next-line class-methods-use-this
  search(value) {
    return fetch(`https://maps.trafimage.ch/search/bps?name=${value}`)
      .then(data => data.json())
      .then(featureCollection => featureCollection.features);
  }

  render(item) {
    return <div>{item.properties.bezeichnung}</div>;
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.properties.bezeichnung;
  }
}

export default Betriebspunkte;
