import React from 'react';
import { render } from '@testing-library/react';
import { Layer, RealtimeLayer as TrackerLayer } from 'mobility-toolbox-js/ol';
import { Map, View } from 'ol';
import MapAccessibility from './MapAccessibility';

let map;
let mapElement;
const trackerLayer = new TrackerLayer({
  visible: true,
  url: 'ws://foo.ch/style',
});
const layer = new Layer({
  visible: true,
  properties: { hasAccessibility: true },
  children: [trackerLayer],
});

describe('MapAccessibility', () => {
  beforeEach(() => {
    TrackerLayer.prototype.purgeTrajectory = () => {
      return false;
    };
    TrackerLayer.prototype.renderTrajectoriesInternal = () => {};
    TrackerLayer.prototype.hasFeatureInfoAtCoordinate = jest.fn(() => true);
    mapElement = document.createElement('div');
    mapElement.tabIndex = 1;
    mapElement.tabindex = 1;
    document.body.appendChild(mapElement);
    map = new Map({
      target: mapElement,
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });
    trackerLayer.attachToMap(map);
    trackerLayer.trajectories = {
      1: {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [1, 0] },
        properties: {
          id: 1,
          train_id: 1,
          coordinate: [1, 0],
          time_intervals: [],
        },
      },
      2: {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [1, 0] },
        properties: {
          id: 2,
          train_id: 2,
          coordinate: [0, 1],
          time_intervals: [],
        },
      },
    };
  });

  afterEach(() => {
    TrackerLayer.prototype.renderTrajectoriesInternal = () => {};
    TrackerLayer.prototype.hasFeatureInfoAtCoordinate.mockRestore();
    trackerLayer.detachFromMap(map);
    document.body.removeChild(mapElement);
  });

  test('should return null', () => {
    const { container } = render(
      <MapAccessibility map={map} layers={[layer]} />,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  test('should go through vehicles on TAB event', () => {
    const event = new KeyboardEvent('keydown', { which: 9 });
    const eventShift = new KeyboardEvent('keydown', {
      which: 9,
      shiftKey: true,
    });
    const spy = jest.spyOn(event, 'preventDefault');
    const spy2 = jest.spyOn(eventShift, 'preventDefault');
    render(<MapAccessibility map={map} layers={[layer]} />);
    mapElement.focus();
    // Go to vehicle with smaller x coordinate
    document.dispatchEvent(event);
    expect(trackerLayer.hoverVehicleId).toBe(2);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(0);
    spy.mockReset();
    spy2.mockReset();

    // Go to next vehicle
    document.dispatchEvent(event);
    expect(trackerLayer.hoverVehicleId).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(0);
    spy.mockReset();
    spy2.mockReset();

    // Go to previous vehicle
    document.dispatchEvent(eventShift);
    expect(trackerLayer.hoverVehicleId).toBe(2);
    expect(spy).toHaveBeenCalledTimes(0);
    expect(spy2).toHaveBeenCalledTimes(1);
    spy.mockReset();
    spy2.mockReset();

    // Go outside
    document.dispatchEvent(event);
    document.dispatchEvent(event);
    expect(trackerLayer.hoverVehicleId).toBe(null);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(0);
    spy.mockRestore();
    spy2.mockRestore();
  });

  test('should trigger maps singleclick event if a vehicle is selected', () => {
    const event = new KeyboardEvent('keydown', { which: 9 });
    const eventEnter = new KeyboardEvent('keydown', { which: 13 });
    const spy = jest.spyOn(eventEnter, 'preventDefault');
    const spy2 = jest.spyOn(map, 'dispatchEvent');
    render(<MapAccessibility map={map} layers={[layer]} />);
    mapElement.focus();
    // Go to vehicle with smaller x coordinate
    document.dispatchEvent(event);
    document.dispatchEvent(eventEnter);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2.mock.calls[0][0].type).toBe('singleclick');
    expect(spy2.mock.calls[0][0].map).toBe(map);
    expect(spy2.mock.calls[0][0].coordinate).toEqual([0, 1]);
  });

  test('remove listener on unmount', () => {
    const event = new KeyboardEvent('keydown', { which: 9 });
    const spy = jest.spyOn(event, 'preventDefault');
    const { unmount } = render(<MapAccessibility map={map} layers={[layer]} />);
    unmount();
    mapElement.focus();
    // Go to vehicle with smaller x coordinateu
    document.dispatchEvent(event);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
