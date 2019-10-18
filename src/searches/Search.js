import OLGeoJSON from 'ol/format/GeoJSON';

class Search {
  constructor() {
    this.geoJSON = new OLGeoJSON();
    this.collapsed = true;
    this.showInPlaceholder = true;
    this.dataProjection = 'EPSG:4326';
  }

  getItems() {
    return this.collapsed ? this.items.slice(0, 2) : this.items;
  }

  getFeature(item, options) {
    return this.geoJSON.readFeature(item, {
      ...options,
      dataProjection: this.dataProjection,
    });
  }

  setItems(items) {
    this.items = items;
  }

  setProps(props) {
    this.props = props;
  }

  collapse(collapsed) {
    this.collapsed = collapsed;
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  select(item) {
    // Can be overwritten by sub-classes.
  }
}

export default Search;
