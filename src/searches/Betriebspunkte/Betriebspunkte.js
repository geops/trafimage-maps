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
    return fetch(`${baseUrl}/search/bps?name=${encodeURIComponent(value)}`)
      .then((data) => data.json())
      .then((featureCollection) => featureCollection.features)
      .catch(() => {
        return [];
      });
  }

  render(item) {
    return <div>{item.properties.bezeichnung}</div>;
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.properties.bezeichnung;
  }
}

export default Betriebspunkte;
