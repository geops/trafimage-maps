export const SET_ACTIVE_TOPIC = 'SET_ACTIVE_TOPIC';
export const SET_CLICKED_FEATURES = 'SET_CLICKED_FEATURES';
export const SET_LANGUAGE = 'SET_LANGUAGE';

export const setActiveTopic = data => ({ type: SET_ACTIVE_TOPIC, data });

export const setLanguage = data => ({ type: SET_LANGUAGE, data });

export const setClickedFeatures = data => ({
  type: SET_CLICKED_FEATURES,
  data,
});
