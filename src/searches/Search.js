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
}

export default Search;
