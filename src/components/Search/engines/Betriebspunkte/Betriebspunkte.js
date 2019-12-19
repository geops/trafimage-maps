import React from 'react';

import createTrafimageEngine from '../createTrafimageEngine';

class Betriebspunkte extends createTrafimageEngine() {
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

  static value(item) {
    return item.properties.bezeichnung;
  }
}

export default Betriebspunkte;
