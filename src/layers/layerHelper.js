function getDataResolution(resolution) {
  return [750, 500, 250, 100, 75, 50, 20, 10, 5].reduce((prev, curr) =>
    Math.abs(curr - resolution) < Math.abs(prev - resolution) ? curr : prev,
  );
}

// Old resolution without 75
// for data that has not been updated, yet
function getOldDataResolution(resolution) {
  return [750, 500, 250, 100, 50, 20, 10, 5].reduce((prev, curr) =>
    Math.abs(curr - resolution) < Math.abs(prev - resolution) ? curr : prev,
  );
}

function getGeneralization(resolution) {
  const res = getDataResolution(resolution);
  return (
    { 750: 5, 500: 10, 250: 30, 100: 30, 75: 100, 50: 100, 20: 100 }[res] || 150
  );
}

// Old resolution - generalization mapping without 5 & 150
// for data that has not been updated, yet
function getOldGeneralization(resolution) {
  const res = getOldDataResolution(resolution);
  return { 750: 10, 500: 10, 250: 30, 100: 30 }[res] || 100;
}

// Map resolutions by zoom (array index)
const resolutions = [
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

// Data resolutions by zoom (array index)
// based on https://confluence.geops.ch/pages/viewpage.action?spaceKey=TRAFIMAGETEAM&title=Gruppierung+Vector+Tiles
const movedDataResolutions = [
  750,
  750,
  750,
  750,
  750,
  750,
  750,
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
  5,
];

// New resolution - generalization mapping
// based on https://confluence.geops.ch/pages/viewpage.action?spaceKey=TRAFIMAGETEAM&title=Gruppierung+Vector+Tiles
function getMovedDataResolution(resolution) {
  const res = resolutions.reduce((prev, curr) =>
    Math.abs(curr - resolution) < Math.abs(prev - resolution) ? curr : prev,
  );

  const z = resolutions.indexOf(res);
  return movedDataResolutions[z];
}

export default {
  resolutions,
  getDataResolution,
  getOldDataResolution,
  getMovedDataResolution,
  getGeneralization,
  getOldGeneralization,
};
