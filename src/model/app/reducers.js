import i18n from 'i18next';
import { defaults as defaultInteractions } from 'ol/interaction';
import LayerService from 'react-spatial/LayerService';
import OLMap from 'ol/Map';
import {
  updateDrawEditLink,
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
  SET_PERMISSION_INFOS,
  SET_SCREEN_WIDTH,
  SET_CARTARO_OLD_URL,
  SET_MAPSET_URL,
  SET_DRAW_URL,
  SET_DRAW_OLD_URL,
  SET_DRAW_IDS,
  SET_SHORTENER_URL,
  SET_DRAW_EDIT_LINK_LOADING,
  SET_DRAW_EDIT_LINK,
} from './actions';

import SearchService from '../../components/Search/SearchService';

const getInitialState = () => ({
  // We set the permission to null instead of a default empty object
  // to know when the request has been done.
  permissionInfos: null,
  topics: [],
  featureInfo: [],
  language: 'de',
  projection: {
    label: 'WGS 84',
    value: 'EPSG:4326',
    format: (c) => c,
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
  drawIds: null,
});

export default function app(state = getInitialState(), action) {
  updateDrawEditLink();
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
    case SET_PERMISSION_INFOS:
      return {
        ...state,
        permissionInfos: action.data || {
          user: null,
          permissions: [],
        },
      };
    case SET_MAPSET_URL:
      return {
        ...state,
        mapsetUrl: action.data,
      };
    case SET_SHORTENER_URL:
      return {
        ...state,
        shortenerUrl: action.data,
      };
    case SET_DRAW_URL:
      return {
        ...state,
        drawUrl: action.data,
      };
    case SET_DRAW_OLD_URL:
      return {
        ...state,
        drawOldUrl: action.data,
      };
    case SET_CARTARO_OLD_URL:
      return {
        ...state,
        cartaroOldUrl: action.data,
      };
    case SET_SCREEN_WIDTH:
      return {
        ...state,
        screenWidth: action.data,
      };
    case SET_DRAW_IDS:
      return {
        ...state,
        drawIds: action.data,
      };
    case SET_DRAW_EDIT_LINK_LOADING:
      return {
        ...state,
        isDrawEditLinkLoading: action.data,
      };
    case SET_DRAW_EDIT_LINK:
      return {
        ...state,
        drawEditLink: action.data,
      };
    default:
      return {
        ...state,
      };
  }
}
