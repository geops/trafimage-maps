import i18n from 'i18next';
import {
  SET_ACTIVE_TOPIC,
  SET_CLICKED_FEATURE_INFO,
  SET_LANGUAGE,
} from './actions';

const initialState = {
  clickedFeatureInfo: null,
  language: 'de',
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case SET_LANGUAGE:
      i18n.changeLanguage(action.data);
      return {
        ...state,
        language: action.data,
      };
    case SET_CLICKED_FEATURE_INFO:
      return {
        ...state,
        clickedFeatureInfo: action.data ? { ...action.data } : null,
      };
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
