import OLGeoJSON from 'ol/format/GeoJSON';

import { highlight } from '../model/map/actions';

const geoJSON = new OLGeoJSON();

class Search {
  constructor() {
    this.collapsed = true;
    this.showInPlaceholder = true;
  }

  getActiveTopic() {
    return this.activeTopic;
  }

  setActiveTopic(activeTopic) {
    this.activeTopic = activeTopic;
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch;
  }

  setItems(items) {
    this.items = items;
  }

  getItems() {
    return this.collapsed ? this.items.slice(0, 2) : this.items;
  }

  collapse(collapsed) {
    this.collapsed = collapsed;
  }

  select(item) {
    const feature = geoJSON.readFeature(item);
    this.dispatch(highlight(feature));
  }
}

export default Search;
