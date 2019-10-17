import OLGeoJSON from 'ol/format/GeoJSON';

class Search {
  constructor() {
    this.geoJSON = new OLGeoJSON();
    this.collapsed = true;
    this.showInPlaceholder = true;
  }

  getItems() {
    return this.collapsed ? this.items.slice(0, 2) : this.items;
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

  select(item, featureProjection) {
    return this.geoJSON.readFeature(item, { featureProjection });
  }
}

export default Search;
