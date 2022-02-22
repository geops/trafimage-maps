import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';

class SearchService {
  constructor(highlightStyle) {
    this.searches = [];
    this.highlightLayer = new OLVectorLayer({
      source: new OLVectorSource({}),
      style: highlightStyle,
    });
  }

  setClear(clear) {
    this.clear = clear;
  }

  setApiKey(apiKey) {
    Object.entries(this.searches).forEach(([, search]) => {
      if (typeof search.setApiKey === 'function') {
        search.setApiKey(apiKey);
      }
    });
  }

  setSearchUrl(url) {
    Object.values(this.searches).forEach((search) => {
      if (typeof search.setSearchUrl === 'function') {
        search.setSearchUrl(url);
      }
    });
  }

  setMap(map) {
    this.map = map;
    this.highlightLayer.setMap(map);
  }

  setSearches(searches = {}) {
    this.searches = searches;
  }

  setSearchesProps(props) {
    Object.values(this.searches).forEach((search) => search.setProps(props));
  }

  setUpsert(upsert) {
    this.upsert = upsert;
  }

  getPlaceholder(t) {
    const sections = Object.entries(this.searches)
      .filter(([, search]) => search.showInPlaceholder)
      .map(([section, search]) => t(search.placeholder || section));
    return `${sections.join(', ')} …`;
  }

  clearHighlight() {
    this.highlightFeature = null;
    this.highlightLayer.getSource().clear();
  }

  highlight(item, persistent = false) {
    this.highlightLayer.getSource().clear();

    this.highlightItem = item;
    const featureProjection = this.map.getView().getProjection();
    const feature = item
      ? this.searches[item.section].getFeature(item, { featureProjection })
      : this.highlightFeature;

    if (feature) {
      this.highlightLayer.getSource().addFeature(feature);
      if (persistent) {
        this.highlightFeature = feature;
        this.map.getView().fit(this.highlightLayer.getSource().getExtent(), {
          padding: [50, 50, 50, 50],
          maxZoom: 15,
          callback: () => this.searches[item.section].openPopup(item),
        });
      }
    }
  }

  highlightSection() {
    if (this.highlightItem) {
      Object.entries(this.searches).forEach(([section, search], position) => {
        search.collapse(section !== this.highlightItem.section);
        this.upsert(section, search.getItems(), position);
      });
    }
  }

  search(value) {
    this.clearHighlight();
    Object.entries(this.searches).forEach(([section, search], position) => {
      search.search(value).then((items) => {
        search.setItems(items);
        this.upsert(section, search.getItems(), position);
      });
    });
  }

  render(item) {
    return this.searches[item.section].render(item);
  }

  select(item) {
    this.searches[item.section].select(item);
    this.highlight(item, true);
  }

  countItems(section) {
    return this.searches[section].items.length;
  }

  toggleSection(toggledSection) {
    Object.entries(this.searches).forEach(([section, search], position) => {
      search.collapse(!(section === toggledSection && search.collapsed));
      this.upsert(section, search.getItems(), position);
    });
  }

  sectionCollapsed(section) {
    return this.searches[section].collapsed;
  }

  value(item) {
    return this.searches[item.section].value(item);
  }
}

export default SearchService;
