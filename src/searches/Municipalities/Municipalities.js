import React from 'react';

import Search from '../Search';

class Municipalities extends Search {
  constructor() {
    super();
    this.showInPlaceholder = false;
    this.dataProjection = 'EPSG:21781';
  }

  // eslint-disable-next-line class-methods-use-this
  search(value) {
    const baseUrl =
      process.env.REACT_APP_SEARCH_URL || 'https://maps.trafimage.ch';
    return fetch(
      `${baseUrl}/search/municipalities?query=${encodeURIComponent(
        value,
      )}&utf8=%E2%9C%93`,
    )
      .then((data) => data.json())
      .then((featureCollection) => featureCollection.features)
      .catch(() => {
        return [];
      });
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
