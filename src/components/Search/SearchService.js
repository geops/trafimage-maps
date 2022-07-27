import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';

class SearchService {
  constructor(highlightStyle) {
    this.searches = [];
    // Contains the highlighted suggestion
    this.highlightLayer = new OLVectorLayer({
      source: new OLVectorSource({}),
      style: highlightStyle,
    });

    // Contains the selected suggestion
    this.selectLayer = new OLVectorLayer({
      source: new OLVectorSource({}),
      style: highlightStyle,
    });
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
    this.selectLayer.setMap(map);
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
    this.highlightLayer.getSource().clear();
  }

  clearSelect() {
    this.selectItem = null;
    this.selectLayer.getSource().clear();
  }

  highlight(item) {
    this.highlightItem = item;
    this.highlightLayer.getSource().clear();

    // it can happens on page load, that if you type very fast then highlight a result this.map is null.
    if (!item || !this.map) {
      return;
    }

    const featureProjection = this.map.getView().getProjection();
    const feature = this.searches[item.section].getFeature(item, {
      featureProjection,
    });

    if (feature) {
      this.highlightLayer.getSource().addFeature(feature);
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
    this.clearSelect();
    const promises = [];
    Object.entries(this.searches).forEach(([section, search], position) => {
      promises.push(
        search.search(value).then((items) => {
          search.setItems(items);
          this.upsert(section, search.getItems(), position);
          return { section, items };
        }),
      );
    });
    return Promise.all(promises);
  }

  render(item) {
    return this.searches[item.section].render(item);
  }

  select(item) {
    // If item is not defined, we zoom on the current highlighted feature.
    this.searches[item.section].select(item);
    this.selectItem = item;
    this.selectLayer.getSource().clear();

    if (!item || !this.map) {
      return;
    }

    const featureProjection = this.map.getView().getProjection();
    const feature = this.searches[item.section].getFeature(item, {
      featureProjection,
    });

    if (feature) {
      this.selectLayer.getSource().addFeature(feature);
    }

    this.map.getView().fit(this.selectLayer.getSource().getExtent(), {
      padding: [50, 50, 50, 50],
      maxZoom: 15.6,
      callback: () => {
        this.searches[item.section].openPopup(item);
      },
    });
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
