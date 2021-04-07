import 'jest-canvas-mock';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { Map, View } from 'ol';
import ExportDialog from '.';

describe('ExportDialog', () => {
  const mockStore = configureStore([thunk]);
  let store;
  let map;

  beforeEach(() => {
    store = mockStore({
      map: {},
      app: {},
    });
    map = new Map({ view: new View({}) });
  });

  test('should match snapshot.', () => {
    const component = renderer.create(
      <Provider store={store}>
        <ExportDialog map={map} name="foo" />
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: test focus document.activeElement on popup close
});
