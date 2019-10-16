import React from 'react';

import Search from '../Search';

class Locations extends Search {
  // eslint-disable-next-line class-methods-use-this
  search(value) {
    return fetch(
      `https://maps.trafimage.ch/api3-geo-admin/SearchServer?type=locations&searchText=${value}`,
    )
      .then(data => data.json())
      .then(response =>
        response.results.map(item => ({
          ...item,
          label: item.attrs.label.replace(/<[^>]*>?/gm, ''),
        })),
      );
  }

  render(item) {
    return <div>{item.label}</div>;
  }

  select(item) {
    super.select({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [item.attrs.lon, item.attrs.lat],
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.label;
  }
}

export default Locations;
