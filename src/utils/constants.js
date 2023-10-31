/* eslint-disable import/prefer-default-export */

import getIsMobileDevice from './getIsMobileDevice';

export const DRAW_PARAM = 'draw.id';
export const DRAW_REDIRECT_PARAM = 'draw.redirect';
export const MAPSET_PARENT_PARAM = 'parent';
export const DRAW_OLD_PARAM = 'wkp.draw';

// matomo tracking variables
export const LS_MATOMO_USER_SESSION_TIMER = 'matomo_user_session_timer';
export const LS_MATOMO_TOPIC_VISITED = 'matomo_topic_visited';
export const MATOMO_TOPIC_CHANGE_ACTION = 'load';
export const MATOMO_TOPIC_CHANGE_TIMER = 30 * 60 * 1000;
export const TRACK_NEW_DRAW_ACTION = 'clickNewDraw';
export const TRACK_SHARE_PERMALINK_ACTION = 'clickSharePermalink';
export const TRACK_SHARE_MAIL_ACTION = 'clickShareMail';
export const TRACK_SHARE_DL_ACTION = 'clickShareDownload';
export const TRACK_SHARE_FB_ACTION = 'clickShareFacebook';
export const TRACK_SHARE_TW_ACTION = 'clickShareTwitter';

// Direktverbindungen
export const DV_KEY = 'ch.sbb.direktverbindungen';
export const DV_DAY_NIGHT_REGEX = new RegExp(`^${DV_KEY}.(day|night)$`);
export const DV_HIT_TOLERANCE = getIsMobileDevice() ? 8 : 2;

// STS
export const STS_KEY = 'ch.sbb.sts';
export const STS_HIT_TOLERANCE = 15;

export const energieleitungenColorMapping = {
  los1: '#12919a',
  los2: '#da1720',
  los3: '#71c520',
  los4: '#f057b3',
  los5: '#f27211',
  los6: '#1486da',
  los7: '#7346bc',
  los8: '#1abebc',
  los9: '#f9b914',
  los10: '#128939',
  los11: '#a3005b',
  ausserhalb: 'black',
};

export const SWISS_EXTENT = [656409.5, 5740863.4, 1200512.3, 6077033.16];

// UI
export const OVERLAY_MIN_HEIGHT = 55;

// PDF export
export const FORCE_EXPORT_PROPERTY = 'forceVisibilityOnPdf';
export const RAILPLUS_EXPORTBTN_ID = 'railplus-export-button';
export const PDF_DOWNLOAD_EVENT_TYPE = 'pdf-download-event';
