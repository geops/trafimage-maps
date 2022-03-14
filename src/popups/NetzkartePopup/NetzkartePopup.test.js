import React from 'react';
import { Provider } from 'react-redux';
import { act, render, screen } from '@testing-library/react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import fetchMock from 'fetch-mock';
import NetzkartePopup from '.';

describe('NetzkartePopup', () => {
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    store = mockStore({
      map: {},
      app: {
        departuresUrl: '//foodepartures',
        apiKey: 'key',
        projection: { value: 'EPSG:3857' },
        language: 'de',
      },
    });
  });

  afterEach(() => {
    fetchMock.reset();
  });

  test('displays only coordinates menu by default', () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    const wrapper = mount(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(wrapper.find('[role="button"]').length).toBe(1);
    expect(wrapper.find('[role="button"]').first().text()).toBe('Koordinaten');
  });

  test('displays airport label.', () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set('layer', ' flug');
    const wrapper = mount(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(wrapper.find('.wkp-netzkarte-popup').children().first().text()).toBe(
      ' flug',
    );
  });

  ['url_interactive_plan', 'url_a4', 'url_poster', 'url_shopping'].forEach(
    (property) => {
      test(`displays plan link if ${property} exists.`, () => {
        const feature = new Feature(
          new Polygon([
            [
              [2, 2],
              [3, 3],
              [4, 4],
            ],
          ]),
        );
        feature.set(property, 'foo');
        const wrapper = mount(
          <Provider store={store}>
            <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
          </Provider>,
        );
        expect(wrapper.find('a.wkp-popup-plans').length).toBe(1);
        expect(wrapper.find('a.wkp-popup-plans').first().text()).toBe(
          'Bahnhofpläne',
        );
        expect(wrapper.find('BahnhofplanPopup').length).toBe(1);
      });
    },
  );

  test('displays bep link if url_bep is available.', () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set('url_bep', 'url_bep');
    const wrapper = mount(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(wrapper.find('a[href="url_bep"]').length).toBe(1);
  });

  test('displays the sbb timetable link if name is available.', () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set('name', 'foo');
    const wrapper = mount(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(wrapper.find('a[href="station_timetable_url"]').length).toBe(1);
    expect(wrapper.find('a[href="station_timetable_url"]').first().text()).toBe(
      ' Fahrplan',
    );
  });

  test('displays the departures link if station has departures.', async () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set('sbb_id', '8500000');
    fetchMock.mock(/foodepartures\/\?key=key&limit=1&uic=8500000/, [{}]);
    await act(async () => {
      render(
        <Provider store={store}>
          <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
        </Provider>,
      );
    });
    expect(screen.getByText('Abfahrtszeiten')).toBeInTheDocument();
  });

  test("doesn't display the departures link if station has no departures.", async () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set('sbb_id', '8500');
    fetchMock.mock(/foodepartures\/\?key=key&limit=1&uic=8500/, []);
    await act(async () => {
      render(
        <Provider store={store}>
          <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
        </Provider>,
      );
    });
    expect(screen.queryByText('Abfahrtszeiten')).toBe(null);
  });

  test('displays the station service link if if station is in Switzerland and layer (only railway) is available.', () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set('sbb_id', '8500000');
    feature.set('rail', 1);
    const wrapper = mount(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(wrapper.find('a[href="station_service_url"]').length).toBe(1);
    expect(wrapper.find('a[href="station_service_url"]').first().text()).toBe(
      ' Webseite Bahnhof',
    );
  });

  test("doesn't display the station service link if station outside CH.", () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set('sbb_id', '85000');
    feature.set('rail', 1);
    const wrapper = mount(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(wrapper.find('a[href="station_service_url"]').length).toBe(0);
  });
});
