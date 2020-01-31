import { transform } from 'ol/proj';
import qs from 'query-string';

const zoomEquivalent = {
  7: 1,
  8: 1,
  9: 2,
  10: 3,
  11: 4,
  12: 5,
  13: 6,
  14: 7,
  15: 8,
  16: 8,
  17: 9,
  18: 10,
};

// Convert zoom from new wkp to old one.
function convertToOldZoom(zoom) {
  return zoomEquivalent[Math.min(Math.max(Math.round(zoom), 7), 18)];
}

function convertUrlParams(urlParams) {
  const params = { ...urlParams };

  if (params.z) {
    // Convert the zoom level to match the different scale on the old wkp.
    params.zoom = convertToOldZoom(params.z);
    delete params.z;
  }

  if (params.x || params.y) {
    // Reproject the coordinates to the old wkp projection: EPSG:21781.
    const [newX, newY] = transform(
      [parseInt(params.x, 10), parseInt(params.y, 10)],
      'EPSG:3857',
      'EPSG:21781',
    );
    params.x = newX;
    params.y = newY;
  }

  return params;
}

function redirect(appBaseUrl, topicKey, overrideParams) {
  const params = {
    ...convertUrlParams(qs.parse(window.location.search)),
    ...overrideParams,
  };

  window.location.href = `${appBaseUrl}/#/${topicKey}?${qs.stringify(params)}`;
}

export default { convertToOldZoom, convertUrlParams, redirect };
