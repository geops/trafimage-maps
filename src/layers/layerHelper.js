// Map resolutions by zoom (array index)
const mapResolutions = [
  156543.033928,
  78271.516964,
  39135.758482,
  19567.879241,
  9783.9396205,
  4891.96981025,
  2445.98490513,
  1222.99245256,
  611.496226281,
  305.748113141,
  152.87405657,
  76.4370282852,
  38.2185141426,
  19.1092570713,
  9.55462853565,
  4.77731426782,
  2.38865713391,
  1.19432856696,
  0.597164283478,
  0.298582141739,
];

const dataResolutions = [750, 500, 250, 100, 75, 50, 20, 10, 5];

function getDataResolution(resolution, resolutions = dataResolutions) {
  return resolutions.reduce((prev, curr) => {
    return Math.abs(curr - resolution) < Math.abs(prev - resolution)
      ? curr
      : prev;
  });
}

function getGeneralization(resolution, resolutions, generalizations) {
  const res = getDataResolution(resolution, resolutions);

  return (
    (generalizations || {
      750: 5,
      500: 10,
      250: 30,
      100: 30,
      75: 100,
      50: 100,
    })[res] || 150
  );
}

function getOldGeneralization(resolution) {
  const res = getDataResolution(resolution);
  return { 750: 10, 500: 10, 250: 30, 100: 30 }[res] || 100;
}

const mapboxDataResolutions = [
  4500, // zoom 0
  4500, // zoom 1
  4500, // etc.
  4500,
  4500,
  4500,
  1500,
  500,
  250,
  100,
  50,
  20,
  10,
  5,
  5,
  5,
  5,
  5,
  5,
  5, // zoom 19
];

/**
 * Get the data resolution for mapbox layers
 *
 * Considers the zoom level substraction for mapbox
 * and the new data resolutions (e.g. 4500, 3000, 1500)
 */
function getMapboxDataResolution(resolution) {
  const mapRes = mapResolutions.reduce((prev, curr) =>
    Math.abs(curr - resolution) < Math.abs(prev - resolution) ? curr : prev,
  );

  // Substract one zoom level
  // as it is also done in the MapboxLayer in react-spatial (why?)
  // see jumpTo in render()
  // see https://github.com/geops/react-spatial/blob/939d9d2535f44b1086e10a187fbb5dc800ae3336/src/layers/MapboxLayer.js#L54
  let mapboxZoom = mapResolutions.indexOf(mapRes) - 1;
  if (mapboxZoom < 0) {
    mapboxZoom = 0;
  }

  return mapboxDataResolutions[mapboxZoom];
}

/**
 * Get the data generalization level for mapbox layers
 *
 * Considers the zoom level substraction for mapbox
 * and the new data resolutions (e.g. 4500, 3000, 1500)
 */
function getMapboxGeneralization(resolution) {
  const res = getMapboxDataResolution(resolution);

  return (
    {
      4500: 5,
      3000: 5,
      1500: 5,
      500: 10,
      250: 30,
      100: 30,
      50: 100,
      20: 100,
    }[res] || 150
  );
}

export default {
  mapResolutions,
  getDataResolution,
  getGeneralization,
  getOldGeneralization,
  getMapboxDataResolution,
  getMapboxGeneralization,
};
