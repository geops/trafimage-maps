import OLGeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke } from 'ol/style';
import highlightPointStyle from '../utils/highlightPointStyle';

class Search {
  constructor() {
    this.geoJSON = new OLGeoJSON();
    this.collapsed = true;
    this.showInPlaceholder = true;
    this.dataProjection = 'EPSG:4326';
    this.highlightStyle = [
      // For lines and polygon
      new Style({
        fill: new Fill({ color: 'rgba(0,61,155,0.2)' }),
        stroke: new Stroke({ color: 'rgba(0,61,155,0.5)', width: 10 }),
      }),
      // For points
      highlightPointStyle,
    ];
  }

  setSearchUrl(url) {
    this.searchUrl = url;
  }

  setStopsUrl(url) {
    this.stopsUrl = url;
  }

  getItems() {
    return this.collapsed ? this.items.slice(0, 2) : this.items;
  }

  getFeature(item, options) {
    const feature = this.geoJSON.readFeature(item, {
      ...options,
      dataProjection: this.dataProjection,
    });
    feature.setStyle(this.highlightStyle);
    return feature;
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
  openPopup() {
    // Can be implemented by sub-classes
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  select(item) {
    // Can be overwritten by sub-classes.
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  clearSelect(item) {
    // Can be overwritten by sub-classes.
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  clearPopup(item) {
    // Can be overwritten by sub-classes.
  }
}

export default Search;
