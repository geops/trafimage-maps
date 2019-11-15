import i18n from 'i18next';
import { defaults as defaultInteractions } from 'ol/interaction';
import LayerService from 'react-spatial/LayerService';
import OLMap from 'ol/Map';
import {
  SET_TOPICS,
  SET_ACTIVE_TOPIC,
  SET_CLICKED_FEATURE_INFO,
  SET_LANGUAGE,
  SET_PROJECTION,
  SET_MENU_OPEN,
  SET_SELECTED_FOR_INFOS,
  SET_DIALOG_VISIBLE,
  SET_DIALOG_POSITION,
  SET_LINE_FILTER,
  SET_ROUTE_FILTER,
  SET_OPERATOR_FILTER,
  SET_DEPARTURES_FILTER,
  SET_SEARCH_SERVICE,
} from './actions';
import SearchService from '../../components/Search/SearchService';
import layerHelper from '../../layers/layerHelper';

const getInitialState = () => ({
  topics: [],
  clickedFeatureInfo: null,
  language: 'de',
  projection: {
    label: 'WGS 84',
    value: 'EPSG:4326',
    format: c => c,
  },
  menuOpen: false,
  selectedForInfos: null,
  map: new OLMap({
    controls: [],
    interactions: defaultInteractions({
      altShiftDragRotate: false,
      pinchRotate: false,
    }),
  }),
  layerService: new LayerService(),
  searchService: new SearchService(layerHelper.highlightStyle),
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
    case SET_CLICKED_FEATURE_INFO:
      return {
        ...state,
        clickedFeatureInfo: action.data ? [...action.data] : null,
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
    case SET_LINE_FILTER:
      return {
        ...state,
        lineFilter: action.data,
      };
    case SET_ROUTE_FILTER:
      return {
        ...state,
        routeFilter: action.data,
      };
    case SET_OPERATOR_FILTER:
      return {
        ...state,
        operatorFilter: action.data,
      };
    case SET_DEPARTURES_FILTER:
      return {
        ...state,
        departuresFilter: action.data,
      };
    default:
      return {
        ...state,
      };
  }
}
