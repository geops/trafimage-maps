import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import IconButton from '@material-ui/core/IconButton';
import { ReactComponent as Pencil } from '../../img/pencil.svg';
import { ReactComponent as PencilAdd } from '../../img/pencil_add.svg';
import DrawButton from '.';

describe('DrawButton', () => {
  const mockStore = configureStore([thunk]);

  const store = mockStore({
    map: {},
    app: { mapsetUrl: 'foo.mapset.ch' },
  });

  test('display basic default icon.', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DrawButton />
      </Provider>,
    );
    expect(wrapper.find(Pencil).length).toBe(1);
  });

  test('display children instead of default icon.', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DrawButton>
          <PencilAdd />
        </DrawButton>
      </Provider>,
    );
    expect(wrapper.find(Pencil).length).toBe(0);
    expect(wrapper.find(PencilAdd).length).toBe(1);
  });

  test('open new window to mapset with an encoded string representing the current url.', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DrawButton />
      </Provider>,
    );
    global.window.open = jest.fn();
    wrapper
      .find(IconButton)
      .at(0)
      .simulate('click', { target: { name: 'width', value: 50 } });
    expect(global.window.open).toBeCalledWith(
      'foo.mapset.ch?parent=http%3A%2F%2Flocalhost%2F',
      '_self',
    );
  });
});
