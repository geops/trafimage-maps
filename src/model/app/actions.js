import qs from 'query-string';
import { DRAW_PARAM, DRAW_REDIRECT_PARAM } from '../../utils/constants';

export const SET_TOPICS = 'SET_TOPICS';
export const SET_ACTIVE_TOPIC = 'SET_ACTIVE_TOPIC';
export const SET_FEATURE_INFO = 'SET_FEATURE_INFO';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_PROJECTION = 'SET_PROJECTION';
export const SET_MENU_OPEN = 'SET_MENU_OPEN';
export const SET_SEARCH_OPEN = 'SET_SEARCH_OPEN';
export const SET_SELECTED_FOR_INFOS = 'SET_SELECTED_FOR_INFOS';
export const SET_DIALOG_VISIBLE = 'SET_DIALOG_VISIBLE';
export const SET_DIALOG_POSITION = 'SET_DIALOG_POSITION';
export const SET_DEPARTURES_FILTER = 'SET_DEPARTURES_FILTER';
export const SET_SEARCH_SERVICE = 'SET_SEARCH_SERVICE';
export const SET_PERMISSION_INFOS = 'SET_PERMISSION_INFOS';
export const SET_SCREEN_WIDTH = 'SET_SCREEN_WIDTH';
export const SET_CARTARO_OLD_URL = 'SET_CARTARO_OLD_URL';
export const SET_MAPSET_URL = 'SET_MAPSET_URL';
export const SET_SHORTENER_URL = 'SET_SHORTENER_URL';
export const SET_DRAW_URL = 'SET_DRAW_URL';
export const SET_DRAW_OLD_URL = 'SET_DRAW_OLD_URL';
export const SET_DRAW_IDS = 'SET_DRAW_IDS';
export const SET_DRAW_EDIT_LINK_LOADING = 'SET_DRAW_EDIT_LINK_LOADING';
export const SET_DRAW_EDIT_LINK = 'SET_DRAW_EDIT_LINK';

export const setTopics = (data) => ({ type: SET_TOPICS, data });

export const setActiveTopic = (data) => ({ type: SET_ACTIVE_TOPIC, data });

export const setLanguage = (data) => {
  // Set HTML language for screen readers.
  document.documentElement.lang = data;
  return { type: SET_LANGUAGE, data };
};
export const setProjection = (data) => ({ type: SET_PROJECTION, data });

export const setFeatureInfo = (data) => ({
  type: SET_FEATURE_INFO,
  data,
});

export const setMenuOpen = (data) => ({ type: SET_MENU_OPEN, data });

export const setSearchOpen = (data) => ({ type: SET_SEARCH_OPEN, data });

export const setDialogVisible = (data) => ({ type: SET_DIALOG_VISIBLE, data });

export const setSelectedForInfos = (data) => ({
  type: SET_SELECTED_FOR_INFOS,
  data,
});

export const setDialogPosition = (data) => ({
  type: SET_DIALOG_POSITION,
  data,
});

export const setDeparturesFilter = (data) => ({
  type: SET_DEPARTURES_FILTER,
  data,
});

export const setScreenWidth = (data) => ({
  type: SET_SCREEN_WIDTH,
  data,
});

export const setSearchService = (data) => ({ type: SET_SEARCH_SERVICE, data });

export const setCartaroOldUrl = (data) => ({ type: SET_CARTARO_OLD_URL, data });

export const setMapsetUrl = (data) => ({ type: SET_MAPSET_URL, data });

export const setShortenerUrl = (data) => ({ type: SET_SHORTENER_URL, data });

export const setDrawUrl = (data) => ({ type: SET_DRAW_URL, data });

export const setDrawOldUrl = (data) => ({ type: SET_DRAW_OLD_URL, data });

export const setDrawIds = (data) => ({ type: SET_DRAW_IDS, data });

export const setDrawEditLinkLoading = (data) => ({
  type: SET_DRAW_EDIT_LINK_LOADING,
  data,
});
export const setDrawEditLink = (data) => ({
  type: SET_DRAW_EDIT_LINK,
  data,
});

/**
 * This function updates the content of a shorten url in backend.
 */
let abortController;
let abortController2;
let oldUrlToShorten;
// This variable is used to avoid having aborted request in the console.
let currentUrlRequested;

export const updateDrawEditLink = () => (dispatch, getState) => {
  const {
    app: { shortenerUrl, drawIds },
  } = getState();
  const drawAdminId = drawIds && drawIds.admin_id;

  if (!drawAdminId) {
    return;
  }

  // Build the url to shorten
  const parsed = qs.parseUrl(window.location.href);
  parsed.query[DRAW_PARAM] = drawAdminId;
  parsed.query[DRAW_REDIRECT_PARAM] = true;
  const urlToShorten = qs.stringifyUrl(parsed);

  if (
    urlToShorten === oldUrlToShorten ||
    currentUrlRequested === urlToShorten
  ) {
    return;
  }

  if (abortController) {
    abortController.abort();
  }

  if (abortController2) {
    abortController2.abort();
  }
  currentUrlRequested = urlToShorten;
  dispatch(setDrawEditLinkLoading(true));

  abortController = new AbortController();

  // we try to update an existing shorten url, if it fails we create a new shorten url.
  // The / before the ? avoid a redirect.
  fetch(
    `${shortenerUrl}/edit/${drawAdminId}/?target=${encodeURIComponent(
      urlToShorten,
    )}`,
    {
      // method: 'POST',
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded',
      // },
      // body: `target=${encodeURIComponent(urlToShorten)}`,
      signal: abortController.signal,
    },
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.error);
      }
      oldUrlToShorten = urlToShorten;
      currentUrlRequested = null;
      dispatch(setDrawEditLinkLoading(false));
      dispatch(setDrawEditLink(data.url));
    })
    .catch((err) => {
      if (err && err.name === 'AbortError') {
        // ignore user abort request
        return;
      }
      if (abortController2) {
        abortController2.abort();
      }
      abortController2 = new AbortController();

      // No shorten url for this drawAdminId so we create a new shorten url.
      // The / before the ? avoid a redirect.
      fetch(
        `${shortenerUrl}/?url=${encodeURIComponent(
          urlToShorten,
        )}&word=${drawAdminId}`,
        {
          // method: 'POST',
          // headers: {
          //   'Content-Type': 'application/x-www-form-urlencoded',
          // },
          // body: `url=${urlToShorten}&word=${drawAdminId}`,
          signal: abortController2.signal,
        },
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          oldUrlToShorten = urlToShorten;
          currentUrlRequested = null;
          dispatch(setDrawEditLinkLoading(false));
          dispatch(setDrawEditLink(data.url));
        })
        .catch((errr) => {
          if (errr && errr.name === 'AbortError') {
            // ignore user abort request
            return;
          }
          dispatch(setDrawEditLinkLoading(false));
          dispatch(setDrawEditLink(urlToShorten));
        });
    });
};
export const setPermissionInfos = (data) => ({
  type: SET_PERMISSION_INFOS,
  data,
});
