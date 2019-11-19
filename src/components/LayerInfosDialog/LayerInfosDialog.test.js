import 'jest-canvas-mock';
import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Layer from 'react-spatial/layers/Layer';
import OLLayer from 'ol/layer/Vector';
import LayerInfosDialog from '.';

configure({ adapter: new Adapter() });

describe('LayerInfosDialog', () => {
  const mockStore = configureStore([thunk]);
  let store;
  let layer;

  beforeEach(() => {
    layer = new Layer({
      name: 'test',
      olLayer: new OLLayer(),
      properties: {
        description: 'description<br/>break',
      },
    });
    store = mockStore({
      app: {
        language: 'de',
        t: t => t,
      },
    });
  });

  test('should match snapshot when Layer is null', () => {
    const component = renderer.create(
      <Provider store={store}>
        <LayerInfosDialog />
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when Layer is defined', () => {
    const component = renderer.create(
      <Provider store={store}>
        <LayerInfosDialog selectedForInfos={layer} />
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
