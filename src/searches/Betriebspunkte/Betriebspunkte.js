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
    const baseUrl =
      process.env.REACT_APP_SEARCH_URL || 'https://maps.trafimage.ch';

    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    return fetch(`${baseUrl}/search/bps?name=${encodeURIComponent(value)}`, {
      signal,
    })
      .then((data) => data.json())
      .then((featureCollection) => featureCollection.features)
      .catch(() => {
        return [];
      });
  }

  render(item) {
    const { bezeichnung: name, abkuerzung: abbreviated } = item.properties;
    return (
      <div>
        {name}
        {abbreviated ? ` ${abbreviated}` : ''}
      </div>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.properties.bezeichnung;
  }
}

export default Betriebspunkte;
