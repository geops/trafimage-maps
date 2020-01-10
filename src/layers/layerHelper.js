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

// Allow to convert zoom from new wkp to old one.
function convertToOldZoom(zoom) {
  if (zoom < 9) {
    return 1;
  }
  if (zoom > 18) {
    return 10;
  }
  return zoomEquivalent[Math.min(Math.max(Math.round(zoom), 9), 18)];
}

const dataResolutions = [750, 500, 250, 100, 50, 20, 10, 5];

function getDataResolution(resolution) {
  return dataResolutions.reduce((prev, curr) =>
    Math.abs(curr - resolution) < Math.abs(prev - resolution) ? curr : prev,
  );
}

function getGeneralization(resolution) {
  const res = getDataResolution(resolution);
  return { 750: 10, 500: 10, 250: 30, 100: 30 }[res] || 100;
}

export default { getDataResolution, getGeneralization, convertToOldZoom };
