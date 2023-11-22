import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { Map, View } from 'ol';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Provider } from 'react-redux';
import { Layer } from 'mobility-toolbox-js/ol';
import { ThemeProvider } from '@material-ui/core/styles';
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
      wrapper = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <TopicElements />
          </Provider>
        </ThemeProvider>,
      );
    });
    const { container } = wrapper;

    expect(container.querySelectorAll('.wkp-header').length).toBe(0);
    expect(container.querySelectorAll('.wkp-footer').length).toBe(0);
    expect(container.querySelectorAll('.rs-base-layer-switcher').length).toBe(
      0,
    );
    // expect(container.querySelectorAll('Permalink').length).toBe(0);
    // expect(container.querySelectorAll('Popup').length).toBe(0);
    // expect(container.querySelectorAll('Overlay').length).toBe(0);
    expect(container.querySelectorAll('.wkp-search').length).toBe(0);

    // Menu
    expect(container.querySelectorAll('.wkp-topics-menu').length).toBe(0);
    // expect(container.querySelectorAll('TrackerMenu').length).toBe(0);
    // expect(container.querySelectorAll('FeatureMenu').length).toBe(0);
    expect(container.querySelectorAll('.wkp-share-menu').length).toBe(0);
    expect(container.querySelectorAll('.wkp-draw-menu').length).toBe(0);
    expect(container.querySelectorAll('.wkp-export-menu').length).toBe(0);

    // MapControls
    expect(container.querySelectorAll('.wkp-map-controls').length).toBe(0);
    expect(container.querySelectorAll('.wkp-geolocation').length).toBe(0);
    expect(container.querySelectorAll('.rs-zoomslider-wrapper').length).toBe(0);
    expect(container.querySelectorAll('.wkp-fit-extent').length).toBe(0);
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
      wrapper = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <TopicElements />
          </Provider>
        </ThemeProvider>,
      );
    });

    const { container } = wrapper;
    expect(container.querySelectorAll('.wkp-header').length).toBe(0);
    expect(container.querySelectorAll('.wkp-footer').length).toBe(0);
    expect(container.querySelectorAll('.rs-base-layer-switcher').length).toBe(
      0,
    );
    // expect(container.querySelectorAll('Permalink').length).toBe(0);
    // expect(container.querySelectorAll('Popup').length).toBe(0);
    // expect(container.querySelectorAll('Overlay').length).toBe(0);
    expect(container.querySelectorAll('.wkp-search').length).toBe(0);

    // Menu
    expect(container.querySelectorAll('.wkp-topics-menu').length).toBe(0);
    // expect(container.querySelectorAll('TrackerMenu').length).toBe(0);
    // expect(container.querySelectorAll('FeatureMenu').length).toBe(0);
    expect(container.querySelectorAll('.wkp-share-menu').length).toBe(0);
    expect(container.querySelectorAll('.wkp-draw-menu').length).toBe(0);
    expect(container.querySelectorAll('.wkp-export-menu').length).toBe(0);

    // MapControls
    expect(container.querySelectorAll('.wkp-map-controls').length).toBe(0);
    expect(container.querySelectorAll('.wkp-geolocation').length).toBe(0);
    expect(container.querySelectorAll('.rs-zoomslider-wrapper').length).toBe(0);
    expect(container.querySelectorAll('.wkp-fit-extent').length).toBe(0);
  });

  // TODO find why the layer switcher and some others are not there
  test.skip('should display everything', async () => {
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

    wrapper = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <TopicElements />
        </Provider>
      </ThemeProvider>,
    );
    const { container } = wrapper;
    await waitFor(() =>
      expect(container.querySelectorAll('.rs-base-layer-switcher').length).toBe(
        1,
      ),
    );
    expect(container.querySelectorAll('.wkp-header').length).toBe(1);
    expect(container.querySelectorAll('.wkp-footer').length).toBe(1);
    expect(container.querySelectorAll('.rs-base-layer-switcher').length).toBe(
      1,
    );
    // expect(container.querySelectorAll('Permalink').length).toBe(2);
    // expect(container.querySelectorAll('Popup').length).toBe(0);
    // expect(container.querySelectorAll('Overlay').length).toBe(1);
    expect(container.querySelectorAll('.wkp-search').length).toBe(1);

    // Menu
    expect(container.querySelectorAll('.wkp-topics-menu').length).toBe(1);
    // expect(container.querySelectorAll('TrackerMenu').length).toBe(0);
    // expect(container.querySelectorAll('FeatureMenu').length).toBe(2);
    expect(container.querySelectorAll('.wkp-share-menu').length).toBe(0);
    expect(container.querySelectorAll('.wkp-draw-menu').length).toBe(1);
    expect(container.querySelectorAll('.wkp-export-menu').length).toBe(1);

    // MapControls
    expect(container.querySelectorAll('.wkp-map-controls').length).toBe(1);
    expect(container.querySelectorAll('.wkp-geolocation').length).toBe(1);
    expect(container.querySelectorAll('.rs-zoomslider-wrapper').length).toBe(1);
    expect(container.querySelectorAll('.wkp-fit-extent').length).toBe(1);
  });
});
