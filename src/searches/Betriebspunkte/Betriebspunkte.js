import React from 'react';
import { Typography } from '@mui/material';

import Search from '../Search';

class Betriebspunkte extends Search {
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
      `${this.searchUrl}/search/bps?name=${encodeURIComponent(value)}`,
      {
        signal,
      },
    )
      .then((data) => data.json())
      .then((featureCollection) => {
        return featureCollection?.features || [];
      })
      .catch(() => {
        return [];
      });
  }

  render(item) {
    const { bezeichnung: name, abkuerzung: abbreviated } = item.properties;
    return (
      <div className="wkp-search-suggestion">
        <Typography>
          {name}
          {abbreviated ? ` (${abbreviated})` : ''}
        </Typography>
      </div>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.properties.bezeichnung;
  }
}

export default Betriebspunkte;
