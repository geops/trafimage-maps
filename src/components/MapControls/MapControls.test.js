import React from 'react';
import { mount } from 'enzyme';
import { Layer, TrackerLayer } from 'mobility-toolbox-js/ol';
import { Map, View } from 'ol';
import { Provider } from 'react-redux';
import MapControls from '.';

let map;
let mapElement;
const trackerLayer = new TrackerLayer({
  visible: true,
});
const layer = new Layer({
  visible: true,
  properties: { hasAccessibility: true },
  children: [trackerLayer],
});

describe('MapControls', () => {
  beforeEach(() => {
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
  });

  afterEach(() => {
    document.body.removeChild(mapElement);
  });

  test('should display all buttons by default', () => {
    const store = global.mockStore({
      app: { map },
    });
    const component = mount(
      <Provider store={store}>
        <MapControls map={map} layers={[layer]} />,
      </Provider>,
    );
    expect(component.find('Zoom').length).toBe(1);
    expect(component.find('.rs-zoom-in svg').length).toBe(1);
    expect(component.find('.rs-zoom-out svg').length).toBe(1);
    expect(component.find('.rs-zoomslider-wrapper').length).toBe(1);
    expect(component.find('Geolocation').length).toBe(1);
    expect(component.find('FitExtent').length).toBe(1);
  });

  test('should not display geolocation', () => {
    const store = global.mockStore({
      app: { map },
    });
    const component = mount(
      <Provider store={store}>
        <MapControls map={map} geolocation={false} />,
      </Provider>,
    );
    expect(component.find('Zoom').length).toBe(1);
    expect(component.find('.rs-zoom-in svg').length).toBe(1);
    expect(component.find('.rs-zoom-out svg').length).toBe(1);
    expect(component.find('.rs-zoomslider-wrapper').length).toBe(1);
    expect(component.find('Geolocation').length).toBe(0);
    expect(component.find('FitExtent').length).toBe(1);
  });

  test('should not display fitExtent', () => {
    const store = global.mockStore({
      app: { map },
    });
    const component = mount(
      <Provider store={store}>
        <MapControls map={map} fitExtent={false} />,
      </Provider>,
    );
    expect(component.find('Zoom').length).toBe(1);
    expect(component.find('.rs-zoom-in svg').length).toBe(1);
    expect(component.find('.rs-zoom-out svg').length).toBe(1);
    expect(component.find('.rs-zoomslider-wrapper').length).toBe(1);
    expect(component.find('Geolocation').length).toBe(1);
    expect(component.find('FitExtent').length).toBe(0);
  });

  test('should not display zoomSlider', () => {
    const store = global.mockStore({
      app: { map },
    });
    const component = mount(
      <Provider store={store}>
        <MapControls map={map} zoomSlider={false} />,
      </Provider>,
    );
    expect(component.find('Zoom').length).toBe(1);
    expect(component.find('.rs-zoom-in svg').length).toBe(1);
    expect(component.find('.rs-zoom-out svg').length).toBe(1);
    expect(component.find('.rs-zoomslider-wrapper').length).toBe(0);
    expect(component.find('Geolocation').length).toBe(1);
    expect(component.find('FitExtent').length).toBe(1);
  });
});
