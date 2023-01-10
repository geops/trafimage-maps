import DrawLayer from '../../layers/DrawLayer';
import {
  SET_LAYERS,
  SET_CENTER,
  SET_RESOLUTION,
  SET_ZOOM,
  SET_MAX_EXTENT,
  SET_MAX_ZOOM,
  SET_MIN_ZOOM,
} from './actions';

const initialState = {
  layers: [],
  drawLayer: new DrawLayer(),
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
        layers: [...action.data],
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
          maxExtent: undefined,
        };
      }
      return {
        ...state,
        maxExtent: action.data,
      };
    case SET_MAX_ZOOM:
      return {
        ...state,
        maxZoom: action.data,
      };
    case SET_MIN_ZOOM:
      return {
        ...state,
        minZoom: action.data,
      };
    default:
      return {
        ...state,
      };
  }
}
