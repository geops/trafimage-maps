import React from 'react';

import Search from '../Search';

class Municipalities extends Search {
  constructor() {
    super();
    this.showInPlaceholder = false;
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

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.properties.name;
  }
}

export default Municipalities;
