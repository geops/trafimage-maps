import React from 'react';

import createTrafimageEngine from '../createTrafimageEngine';

class Municipalities extends createTrafimageEngine() {
  constructor() {
    super();
    this.showInPlaceholder = false;
    this.dataProjection = 'EPSG:21781';
  }

  // eslint-disable-next-line class-methods-use-this
  search(value) {
    return fetch(
      `https://maps.trafimage.ch/search/municipalities?query=${value}&utf8=%E2%9C%93`,
    )
      .then(data => data.json())
      .then(featureCollection => featureCollection.features);
  }

  render(item) {
    return <div>{item.properties.name}</div>;
  }

  static value(item) {
    return item.properties.name;
  }
}

export default Municipalities;
