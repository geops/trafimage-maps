export const SET_TOPICS = 'SET_TOPICS';
export const SET_ACTIVE_TOPIC = 'SET_ACTIVE_TOPIC';
export const SET_CLICKED_FEATURE_INFO = 'SET_CLICKED_FEATURE_INFO';
export const SET_LANGUAGE = 'SET_LANGUAGE';

export const setTopics = data => ({ type: SET_TOPICS, data });

export const setActiveTopic = data => ({ type: SET_ACTIVE_TOPIC, data });

export const setLanguage = data => ({ type: SET_LANGUAGE, data });

export const setClickedFeatureInfo = data => ({
  type: SET_CLICKED_FEATURE_INFO,
  data,
});
