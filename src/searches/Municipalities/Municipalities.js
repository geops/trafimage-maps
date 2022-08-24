import { Typography } from '@material-ui/core';
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
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    return fetch(
      `${this.searchUrl}/search/municipalities?query=${encodeURIComponent(
        value,
      )}&utf8=%E2%9C%93`,
      {
        signal,
      },
    )
      .then((data) => data.json())
      .then((featureCollection) => featureCollection.features)
      .catch(() => {
        return [];
      });
  }

  render(item) {
    return (
      <div className="wkp-search-suggestion">
        <Typography>
          <strong>{item.properties.name}</strong>
        </Typography>
      </div>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.properties.name;
  }
}

export default Municipalities;
