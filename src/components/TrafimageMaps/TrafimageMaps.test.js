import 'jest-canvas-mock';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import configureStore from 'redux-mock-store';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer, { act } from 'react-test-renderer';
import App from './App';

configure({ adapter: new Adapter() });
const mockStore = configureStore();

const props = {
  dispatchSetLayers: () => {},
  map: {
    layers: [],
  },
};

describe('App', () => {
  test('App should match snapshot.', () => {
    let component;
    act(() => {
      component = renderer.create(
        <Provider store={mockStore(props)}>
          <App />
        </Provider>,
      );
    });
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('App should render div.', () => {
    const div = document.createElement('div');
    act(() => {
      ReactDOM.render(
        <Provider store={mockStore(props)}>
          <App />
        </Provider>,
        div,
      );
    });
    ReactDOM.unmountComponentAtNode(div);
  });
});
