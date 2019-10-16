class SearchService {
  constructor(activeTopic, clear, upsert, dispatch) {
    this.activeTopic = activeTopic;
    this.clear = clear;
    this.upsert = upsert;
    Object.values(this.activeTopic.searches).forEach(search => {
      search.setActiveTopic(activeTopic);
      search.setDispatch(dispatch);
    });
  }

  getPlaceholder(t) {
    const sections = Object.entries(this.activeTopic.searches)
      .filter(([, search]) => search.showInPlaceholder)
      .map(([section]) => t(section));
    return `${sections.join(', ')} …`;
  }

  search(value) {
    Object.entries(this.activeTopic.searches).forEach(([section, search]) => {
      search.search(value).then(items => {
        search.setItems(items);
        this.upsert(section, search.getItems());
      });
    });
  }

  render(item) {
    return this.activeTopic.searches[item.section].render(item);
  }

  select(item) {
    return this.activeTopic.searches[item.section].select(item);
  }

  countItems(section) {
    return this.activeTopic.searches[section].items.length;
  }

  toggleSection(toggledSection) {
    Object.entries(this.activeTopic.searches).forEach(([section, search]) => {
      search.collapse(!(section === toggledSection && search.collapsed));
      this.upsert(section, search.getItems());
    });
  }

  sectionCollapsed(section) {
    return this.activeTopic.searches[section].collapsed;
  }

  value(item) {
    return this.activeTopic.searches[item.section].value(item);
  }
}

export default SearchService;
