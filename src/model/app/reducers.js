import { SET_ACTIVE_TOPIC } from './actions';

const initialState = {};

export default function app(state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_TOPIC:
      return {
        ...state,
        activeTopic: { ...action.data },
      };
    default:
      return {
        ...state,
      };
  }
}
