import i18n from 'i18next';
import { defaults as defaultInteractions } from 'ol/interaction';
import LayerService from 'react-spatial/LayerService';
import OLMap from 'ol/Map';
import DragPan from 'ol/interaction/DragPan';
import DblClickDragZoom from '../../ol/interaction/DblClickDragZoom';
import DblPointerClickZoomOut from '../../ol/interaction/DblPointerClickZoomOut';
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
  SET_PERMISSION_INFOS,
  SET_SCREEN_WIDTH,
  SET_MAPSET_URL,
  SET_DRAW_URL,
  SET_DRAW_IDS,
  SET_SHORTENER_URL,
  SET_DRAW_EDIT_LINK_LOADING,
  SET_DRAW_EDIT_LINK,
  SET_DESTINATION_URL,
  SET_DEPARTURES_URL,
  SET_API_KEY,
  SET_CARTARO_URL,
  SET_SHOW_POPUPS,
  SET_ENABLE_TRACKING,
  SET_CONSENT_GIVEN,
} from './actions';

import SearchService from '../../components/Search/SearchService';
import { isOpenedByMapset } from '../../utils/redirectHelper';

const dftlInteractions = defaultInteractions({
  altShiftDragRotate: false,
  pinchRotate: false,
});

// It's important to put it before PinchZoom otherwise the pointerdown is stopped by the PinchZoom.
dftlInteractions.insertAt(0, new DblPointerClickZoomOut());

// It's important to put it just after DragPan otherwise the interaction also drag the map.
const index = dftlInteractions
  .getArray()
  .findIndex((interaction) => interaction instanceof DragPan);
dftlInteractions.insertAt(index + 1, new DblClickDragZoom());

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
  dialogPosition: { x: 390, y: 110 },
  // Open the menu when mapset has opened the page.
  menuOpen: isOpenedByMapset(),
  searchOpen: false,
  selectedForInfos: null,
  map: new OLMap({
    controls: [],
    interactions: dftlInteractions,
  }),
  layerService: new LayerService(),
  searchService: new SearchService(),
  screenWidth: null,
  drawIds: null,
  destinationUrl: null,
  departuresUrl: null,
  apiKey: null,
  showPopups: true,
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
        topics: action.data,
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
        activeTopic: action.data,
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
        ...action.data,
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
    case SET_CARTARO_URL:
      return {
        ...state,
        cartaroUrl: action.data,
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
    case SET_DESTINATION_URL:
      return {
        ...state,
        destinationUrl: action.data,
      };
    case SET_DEPARTURES_URL:
      return {
        ...state,
        departuresUrl: action.data,
      };
    case SET_API_KEY:
      return {
        ...state,
        apiKey: action.data,
      };
    case SET_SHOW_POPUPS:
      return {
        ...state,
        showPopups: action.data,
      };
    case SET_ENABLE_TRACKING:
      return {
        ...state,
        enableTracking: action.data,
      };
    case SET_CONSENT_GIVEN:
      return {
        ...state,
        consentGiven: action.data,
      };
    default:
      return {
        ...state,
      };
  }
}
