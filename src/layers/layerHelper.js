// Map resolutions by zoom (array index)
const mapResolutions = [
  156543.033928,
  78271.516964,
  39135.75848201024,
  19567.87924100512,
  9783.93962050256,
  4891.96981025128,
  2445.98490512564,
  1222.99245256282,
  611.49622628141,
  305.748113140705,
  152.8740565703525,
  76.43702828517625,
  38.21851414258813,
  19.109257071294063,
  9.554628535647032,
  4.777314267823516,
  2.388657133911758,
  1.194328566955879,
  0.5971642834779395,
  0.29858214173896974,
];

/**
 * Get the map resolutions
 * where the array index is the zoom level
 */
function getMapResolutions() {
  return mapResolutions;
}

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
  3000,
  1500,
  500,
  250,
  100,
  50,
  20,
  10,
  10,
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
  getMapResolutions,
  getDataResolution,
  getGeneralization,
  getOldGeneralization,
  getMapboxDataResolution,
  getMapboxGeneralization,
};
