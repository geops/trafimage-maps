import i18n from 'i18next';
import {
  SET_TOPICS,
  SET_ACTIVE_TOPIC,
  SET_CLICKED_FEATURE_INFO,
  SET_LANGUAGE,
  SET_MENU_OPEN,
  SET_LAYER_INFOS_OPEN,
  SET_DIALOG_VISIBLE,
} from './actions';

const initialState = {
  topics: [],
  clickedFeatureInfo: null,
  language: 'de',
  menuOpen: false,
  layerInfosOpen: null,
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case SET_TOPICS:
      return {
        ...state,
        topics: [...action.data],
      };
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
    case SET_MENU_OPEN:
      return {
        ...state,
        menuOpen: action.data,
      };
    case SET_LAYER_INFOS_OPEN:
      return {
        ...state,
        dialogVisible: action.data ? 'layerInfos' : false,
        layerInfosOpen: action.data,
      };
    case SET_DIALOG_VISIBLE:
      return {
        ...state,
        dialogVisible: action.data,
        layerInfosOpen: null,
      };
    default:
      return {
        ...state,
      };
  }
}
