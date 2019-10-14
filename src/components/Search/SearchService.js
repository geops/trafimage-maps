class SearchService {
  constructor(activeTopic, clear, upsert) {
    this.activeTopic = activeTopic;
    this.clear = clear;
    this.upsert = upsert;
    Object.values(this.activeTopic.searches).forEach(search =>
      search.setActiveTopic(activeTopic),
    );
  }

  search(value) {
    Object.entries(this.activeTopic.searches).forEach(([section, client]) => {
      client.search(value).then(items => {
        this.upsert(section, items);
      });
    });
  }

  render(item) {
    return this.activeTopic.searches[item.section].render(item);
  }

  select(item) {
    return this.activeTopic.searches[item.section].select(item);
  }

  value(item) {
    return this.activeTopic.searches[item.section].value(item);
  }
}

export default SearchService;
