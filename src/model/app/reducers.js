import i18n from 'i18next';
import { defaults as defaultInteractions } from 'ol/interaction';
import LayerService from 'react-spatial/LayerService';
import OLMap from 'ol/Map';
import {
  SET_TOPICS,
  SET_ACTIVE_TOPIC,
  SET_FEATURE_INFO,
  SET_LANGUAGE,
  SET_PROJECTION,
  SET_MENU_OPEN,
  SET_SEARCH_OPEN,
  SET_SELECTED_FOR_INFOS,
  SET_DIALOG_VISIBLE,
  SET_DIALOG_POSITION,
  SET_DEPARTURES_FILTER,
  SET_SEARCH_SERVICE,
  SET_PERMISSIONS_INFOS,
  SET_SCREEN_WIDTH,
} from './actions';
import SearchService from '../../components/Search/SearchService';

const getInitialState = () => ({
  permissionsInfos: {
    user: null,
    permissions: [],
  },
  topics: [],
  featureInfo: [],
  language: 'de',
  projection: {
    label: 'WGS 84',
    value: 'EPSG:4326',
    format: c => c,
  },
  menuOpen: false,
  searchOpen: false,
  selectedForInfos: null,
  map: new OLMap({
    controls: [],
    interactions: defaultInteractions({
      altShiftDragRotate: false,
      pinchRotate: false,
    }),
  }),
  layerService: new LayerService(),
  searchService: new SearchService(),
  screenWidth: null,
});

export default function app(state = getInitialState(), action) {
  switch (action.type) {
    case SET_SEARCH_SERVICE:
      return {
        ...state,
        searchService: action.data,
      };
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
    case SET_PROJECTION:
      return {
        ...state,
        projection: action.data,
      };
    case SET_FEATURE_INFO:
      return {
        ...state,
        featureInfo: action.data ? [...action.data] : null,
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
    case SET_SEARCH_OPEN:
      return {
        ...state,
        searchOpen: action.data,
      };
    case SET_SELECTED_FOR_INFOS:
      return {
        ...state,
        dialogVisible: action.data ? 'infoDialog' : false,
        selectedForInfos: action.data,
      };
    case SET_DIALOG_VISIBLE:
      return {
        ...state,
        dialogVisible: action.data,
        selectedForInfos: null,
      };
    case SET_DIALOG_POSITION:
      return {
        ...state,
        dialogPosition: action.data,
      };
    case SET_DEPARTURES_FILTER:
      return {
        ...state,
        departuresFilter: action.data,
      };
    case SET_PERMISSIONS_INFOS:
      return {
        ...state,
        permissionsInfos: action.data,
      };
    case SET_SCREEN_WIDTH:
      return {
        ...state,
        screenWidth: action.data,
      };
    default:
      return {
        ...state,
      };
  }
}
