import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { Map, View } from 'ol';
import { Provider } from 'react-redux';
import { Layer } from 'mobility-toolbox-js/ol';
import { ThemeProvider } from '@material-ui/core/styles';
import LayerService from '../../utils/LayerService';
import theme from '../../themes/default';
import TopicElements from '.';

let map;
let mapElement;
const proj = {
  label: 'CH1903 / LV03',
  value: 'EPSG:21781',
  format: (c) => c,
};
const topic = {
  key: 'lala',
  elements: {},
};
let dfltStore = null;

describe('TopicElements', () => {
  beforeEach(() => {
    window.matchMedia = global.createMatchMedia(window.innerWidth);
    mapElement = document.createElement('div');
    mapElement.tabIndex = 1;
    document.body.appendChild(mapElement);
    map = new Map({
      target: mapElement,
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });
    dfltStore = {
      app: {
        map,
        language: 'de',
        menuOpen: true,
        projection: proj,
        layerService: new LayerService([]),
        topics: [topic],
        activeTopic: topic,
        appBaseUrl: 'foo.ch',
        staticFilesUrl: 'staticfoo.ch',
      },
      map: { layers: [], drawLayer: new Layer() },
    };
  });

  afterEach(() => {
    document.body.removeChild(mapElement);
  });

  test('should display only default component (basically nothing)', async () => {
    const tpc = {
      key: 'lala',
      elements: {},
    };
    const store = global.mockStore({
      ...dfltStore,
      app: {
        ...dfltStore.app,
        activeTopic: tpc,
      },
    });
    let wrapper = null;
    await act(async () => {
      wrapper = mount(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <TopicElements />
          </Provider>
        </ThemeProvider>,
      );
    });

    expect(wrapper.find('Header').length).toBe(0);
    expect(wrapper.find('Memo(Footer)').length).toBe(0);
    expect(wrapper.find('BaseLayerSwitcher').length).toBe(0);
    expect(wrapper.find('Permalink').length).toBe(0);
    expect(wrapper.find('Popup').length).toBe(0);
    expect(wrapper.find('Overlay').length).toBe(0);
    expect(wrapper.find('Memo(Search)').length).toBe(0);

    // Menu
    expect(wrapper.find('TopicsMenu').length).toBe(0);
    expect(wrapper.find('TrackerMenu').length).toBe(0);
    expect(wrapper.find('FeatureMenu').length).toBe(0);
    expect(wrapper.find('ShareMenu').length).toBe(0);
    expect(wrapper.find('Memo(DrawMenu)').length).toBe(0);
    expect(wrapper.find('Memo(ExportMenu)').length).toBe(0);

    // MapControls
    expect(wrapper.find('MapControls').length).toBe(0);
    expect(wrapper.find('Geolocation').length).toBe(0);
    expect(wrapper.find('.rs-zoomslider-wrapper').length).toBe(0);
    expect(wrapper.find('FitExtent').length).toBe(0);
  });

  test('should display nothing', async () => {
    const tpc = {
      key: 'lala',
      elements: {
        header: false,
        footer: false,
        search: false,
        permalink: false,
        popup: false,
        baseLayerSwitcher: false,
        overlay: false,

        // Menu
        menu: false,
        shareMenu: false,
        drawMenu: false,
        trackerMenu: false,
        featureMenu: false,
        exportMenu: false,

        // MapControls
        mapControls: false,
        geolocationButton: false,
        zoomSlider: false,
        fitExtent: false,
      },
    };
    const store = global.mockStore({
      ...dfltStore,
      app: { ...dfltStore.app, activeTopic: tpc },
    });
    let wrapper = null;
    await act(async () => {
      wrapper = mount(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <TopicElements />
          </Provider>
        </ThemeProvider>,
      );
    });

    expect(wrapper.find('Header').length).toBe(0);
    expect(wrapper.find('Memo(Footer)').length).toBe(0);
    expect(wrapper.find('BaseLayerSwitcher').length).toBe(0);
    expect(wrapper.find('Permalink').length).toBe(0);
    expect(wrapper.find('Popup').length).toBe(0);
    expect(wrapper.find('Overlay').length).toBe(0);
    expect(wrapper.find('Memo(Search)').length).toBe(0);

    // Menu
    expect(wrapper.find('TopicsMenu').length).toBe(0);
    expect(wrapper.find('TrackerMenu').length).toBe(0);
    expect(wrapper.find('FeatureMenu').length).toBe(0);
    expect(wrapper.find('ShareMenu').length).toBe(0);
    expect(wrapper.find('Memo(DrawMenu)').length).toBe(0);
    expect(wrapper.find('Memo(ExportMenu)').length).toBe(0);

    // MapControls
    expect(wrapper.find('MapControls').length).toBe(0);
    expect(wrapper.find('Geolocation').length).toBe(0);
    expect(wrapper.find('.rs-zoomslider-wrapper').length).toBe(0);
    expect(wrapper.find('FitExtent').length).toBe(0);
  });

  test('should display everything', async () => {
    const tpc = {
      key: 'lala',
      elements: {
        header: true,
        footer: true,
        search: true,
        permalink: true,
        popup: true,
        baseLayerSwitcher: true,
        overlay: true,

        // Menu
        menu: true,
        shareMenu: true,
        drawMenu: true,
        trackerMenu: true,
        featureMenu: true,
        exportMenu: true,

        // MapControls
        mapControls: true,
        geolocationButton: true,
        zoomSlider: true,
        fitExtent: true,
      },
    };
    const store = global.mockStore({
      ...dfltStore,
      app: { ...dfltStore.app, activeTopic: tpc },
    });
    let wrapper = null;

    await act(async () => {
      wrapper = mount(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <TopicElements />
          </Provider>
        </ThemeProvider>,
      );
    });

    expect(wrapper.find('Header').length).toBe(1);
    expect(wrapper.find('Memo(Footer)').length).toBe(1);
    expect(wrapper.find('BaseLayerSwitcher').length).toBe(1);
    expect(wrapper.find('Permalink').length).toBe(2);
    expect(wrapper.find('Popup').length).toBe(0);
    expect(wrapper.find('Overlay').length).toBe(1);
    expect(wrapper.find('Memo(Search)').length).toBe(1);

    // Menu
    expect(wrapper.find('TopicsMenu').length).toBe(1);
    expect(wrapper.find('TrackerMenu').length).toBe(0); // TrackerMenu onl ydisplayed if there is a featureinfo
    expect(wrapper.find('FeatureMenu').length).toBe(2); // FeatureMenu + TrackerMenu
    expect(wrapper.find('ShareMenu').length).toBe(0);
    expect(wrapper.find('Memo(DrawMenu)').length).toBe(1);
    expect(wrapper.find('Memo(ExportMenu)').length).toBe(1);

    // MapControls
    expect(wrapper.find('MapControls').length).toBe(1);
    expect(wrapper.find('Geolocation').length).toBe(1);
    expect(wrapper.find('.rs-zoomslider-wrapper').length).toBe(1);
    expect(wrapper.find('FitExtent').length).toBe(1);
  });
});
