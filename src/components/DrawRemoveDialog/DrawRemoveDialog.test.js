import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { Layer } from 'mobility-toolbox-js/ol';
import OLLayer from 'ol/layer/Vector';
import { mount } from 'enzyme';
import DrawRemoveDialog from '.';

describe('DrawRemoveDialog', () => {
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    store = mockStore({
      app: {
        dialogPosition: {
          top: 0,
          left: 0,
        },
      },
      map: {
        drawlayer: new Layer({
          name: 'test',
          olLayer: new OLLayer(),
          properties: {
            description: 'description<br/>break',
          },
        }),
      },
    });
  });

  test('should match snapshot', () => {
    const component = renderer.create(
      <Provider store={store}>
        <DrawRemoveDialog />
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('remove permalink on click on remove button', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DrawRemoveDialog />
      </Provider>,
    );
    expect(wrapper.find('input').at(0).value).toBe();
  });
});
