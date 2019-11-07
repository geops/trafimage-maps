export const SET_TOPICS = 'SET_TOPICS';
export const SET_ACTIVE_TOPIC = 'SET_ACTIVE_TOPIC';
export const SET_CLICKED_FEATURE_INFO = 'SET_CLICKED_FEATURE_INFO';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_PROJECTION = 'SET_PROJECTION';
export const SET_MENU_OPEN = 'SET_MENU_OPEN';
export const SET_SELECTED_FOR_INFOS = 'SET_SELECTED_FOR_INFOS';
export const SET_DIALOG_VISIBLE = 'SET_DIALOG_VISIBLE';
export const SET_DIALOG_POSITION = 'SET_DIALOG_POSITION';
export const SET_SEARCH_SERVICE = 'SET_SEARCH_SERVICE';

export const setTopics = data => ({ type: SET_TOPICS, data });

export const setActiveTopic = data => ({ type: SET_ACTIVE_TOPIC, data });

export const setLanguage = data => ({ type: SET_LANGUAGE, data });

export const setProjection = data => ({ type: SET_PROJECTION, data });

export const setClickedFeatureInfo = data => ({
  type: SET_CLICKED_FEATURE_INFO,
  data,
});

export const setMenuOpen = data => ({ type: SET_MENU_OPEN, data });

export const setDialogVisible = data => ({ type: SET_DIALOG_VISIBLE, data });

export const setSelectedForInfos = data => ({
  type: SET_SELECTED_FOR_INFOS,
  data,
});

export const setDialogPosition = data => ({
  type: SET_DIALOG_POSITION,
  data,
});

export const setSearchService = data => ({ type: SET_SEARCH_SERVICE, data });
