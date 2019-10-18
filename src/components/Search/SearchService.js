import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';

class SearchService {
  constructor() {
    this.searches = [];
    this.highlightLayer = new OLVectorLayer({ source: new OLVectorSource({}) });
  }

  setClear(clear) {
    this.clear = clear;
  }

  setMap(map) {
    this.map = map;
    this.highlightLayer.setMap(map);
  }

  setSearches(searches) {
    this.searches = searches;
  }

  setSearchProps(props) {
    Object.values(this.searches).forEach(search => search.setProps(props));
  }

  setUpsert(upsert) {
    this.upsert = upsert;
  }

  getPlaceholder(t) {
    const sections = Object.entries(this.searches)
      .filter(([, search]) => search.showInPlaceholder)
      .map(([section]) => t(section));
    return `${sections.join(', ')} …`;
  }

  highlight(item, fitExtent = false) {
    if (item) {
      this.highlightLayer.getSource().clear();
      const featureProjection = this.map.getView().getProjection();
      const feature = this.searches[item.section].getFeature(item, {
        featureProjection,
      });
      if (feature) {
        this.highlightLayer.getSource().addFeature(feature);
        if (fitExtent) {
          this.map.getView().fit(this.highlightLayer.getSource().getExtent(), {
            padding: [50, 50, 50, 50],
            duration: 500,
            maxZoom: 15,
          });
        }
      }
    }
  }

  search(value) {
    Object.entries(this.searches).forEach(([section, search]) => {
      search.search(value).then(items => {
        search.setItems(items);
        this.upsert(section, search.getItems());
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
    Object.entries(this.searches).forEach(([section, search]) => {
      search.collapse(!(section === toggledSection && search.collapsed));
      this.upsert(section, search.getItems());
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
