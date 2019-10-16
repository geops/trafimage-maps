import {
  HIGHLIGHT,
  SET_LAYERS,
  SET_CENTER,
  SET_RESOLUTION,
  SET_ZOOM,
} from './actions';

const initialState = {
  layers: [],
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case HIGHLIGHT:
      return {
        ...state,
        highlight: action.feature,
      };
    case SET_LAYERS:
      return {
        ...state,
        layers: [...action.data],
      };
    case SET_CENTER:
      return {
        ...state,
        center: [...action.data],
      };
    case SET_RESOLUTION:
      return {
        ...state,
        resolution: action.data,
      };
    case SET_ZOOM:
      return {
        ...state,
        zoom: action.data,
      };
    default:
      return {
        ...state,
      };
  }
}
