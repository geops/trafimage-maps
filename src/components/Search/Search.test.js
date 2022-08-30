import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Map, View } from 'ol';
import Search from '.';
import SearchService from './SearchService';
import { Search as SearchDflt } from '../../searches';

const dfltApp = {
  map: new Map({ view: new View({}) }),
  activeTopic: {
    key: 'test',
  },
  language: 'de',
  searchInfoOpen: false,
};
const mockStore = configureStore([thunk]);

class MockSearch extends SearchDflt {
  // eslint-disable-next-line class-methods-use-this
  search() {
    return Promise.resolve([
      { id: 'test', title: 'Test' },
      { id: 'test2', title: 'Test2' },
      { id: 'test3', title: 'Test3' },
      { id: 'test4', title: 'Test4' },
      { id: 'test5', title: 'Test5' },
    ]);
  }

  render(item) {
    return <div>{item.title}</div>;
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.title;
  }
}

describe('Search', () => {
  const dfltSearch = new MockSearch();

  const searchService = new SearchService();
  searchService.setSearches([dfltSearch, dfltSearch]);

  const dfltStore = {
    app: {
      ...dfltApp,
      searchService,
    },
  };

  test('render inputs.', () => {
    const store = mockStore(dfltStore);

    const wrapper = mount(
      <Provider store={store}>
        <Search />
      </Provider>,
    );
    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('.wkp-search-button').length).toBe(5); // The class name is forwarded by mui on child elements.
  });

  test('launch search and render multiple collapsed sections.', async () => {
    let wrapper = null;
    await act(async () => {
      const store = mockStore(dfltStore);
      wrapper = mount(
        <Provider store={store}>
          <Search />
        </Provider>,
      );
      wrapper.find('input').getDOMNode().value = 'test';
      wrapper
        .find('input')
        .first()
        .simulate('focus', { target: { value: 'test' } });
      wrapper
        .find('input')
        .first()
        .simulate('change', { target: { value: 'test' } });
      await searchService.search('test');
      wrapper.update();
    });
    expect(wrapper.find('.wkp-search-section-header').length).toBe(2);
    expect(
      wrapper.find('.wkp-search-section-header').find('span').at(1).text(),
    ).toBe('overallResult');
    expect(wrapper.find('Item').length).toBe(4);
  });
});
