import React from 'react';

import Search from '../Search';

class Locations extends Search {
  // eslint-disable-next-line class-methods-use-this
  search(value) {
    const baseUrl =
      process.env.REACT_APP_SEARCH_URL || 'https://maps.trafimage.ch';
    return fetch(
      `${baseUrl}/api3-geo-admin/SearchServer?type=locations&searchText=${encodeURIComponent(
        value,
      )}`,
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
    return <div>{item.label}</div>;
  }

  getFeature(item, options) {
    return super.getFeature(
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [item.attrs.lon, item.attrs.lat],
        },
      },
      options,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.label;
  }
}

export default Locations;
