import React from 'react';
import { Typography } from '@material-ui/core';

import Search from '../Search';

class Locations extends Search {
  // eslint-disable-next-line class-methods-use-this
  search(value) {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    return fetch(
      `${
        this.searchUrl
      }/api3-geo-admin/SearchServer?type=locations&searchText=${encodeURIComponent(
        value,
      )}`,
      {
        signal,
      },
    )
      .then((data) => data.json())
      .then((response) =>
        response.results.map((item) => ({
          ...item,
          label: item.attrs.label.replace(/<[^>]*>?/gm, ''),
        })),
      )
      .catch(() => {
        return [];
      });
  }

  render(item) {
    return (
      <div className="wkp-search-suggestion">
        <Typography>{item.label}</Typography>
      </div>
    );
  }

  getFeature(item, options) {
    const feature = super.getFeature(
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [item.attrs.lon, item.attrs.lat],
        },
        properties: {
          ...item.attrs,
          section: item.section,
        },
      },
      options,
    );
    return feature;
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.label;
  }
}

export default Locations;
