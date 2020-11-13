import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Layer } from 'mobility-toolbox-js/ol';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';
import {
  SET_LAYERS,
  SET_CENTER,
  SET_RESOLUTION,
  SET_ZOOM,
  SET_MAX_EXTENT,
} from './actions';

const drawLayer = new Layer({
  name: 'draw',
  key: 'draw',
  properties: {
    hideInLegend: true,
  },
  olLayer: new VectorLayer({
    source: new VectorSource({
      features: [
        new Feature({
          geometry: new Point(fromLonLat([8.1, 46.9])),
        }),
      ],
    }),
    style: () => {
      return new Style({
        zIndex: 10000,
        image: new Circle({
          radius: 15,
          fill: new Fill({
            color: 'rgba(0, 61, 133, 0.8)',
          }),
        }),
      });
    },
  }),
});

const initialState = {
  layers: [drawLayer],
  drawLayer,
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case SET_LAYERS:
      if (!Array.isArray(action.data)) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        layers: [...action.data, drawLayer],
        drawLayer,
      };
    case SET_CENTER:
      if (!Array.isArray(action.data)) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        center: [...action.data],
      };
    case SET_RESOLUTION:
      if (!action.data) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        resolution: action.data,
      };
    case SET_ZOOM:
      if (!action.data) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        zoom: action.data,
      };
    case SET_MAX_EXTENT:
      if (!action.data) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        maxExtent: action.data,
      };
    default:
      return {
        ...state,
      };
  }
}
