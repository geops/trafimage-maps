const dataResolutions = [900, 850, 500, 250, 115, 100, 75, 50, 20, 10, 5];

function getDataResolution(resolution) {
  return dataResolutions.reduce((prev, curr) =>
    Math.abs(curr - resolution) < Math.abs(prev - resolution) ? curr : prev,
  );
}

function getGeneralization(resolution) {
  const res = getDataResolution(resolution);

  return (
    { 900: 5, 850: 10, 500: 10, 250: 30, 115: 30, 100: 100, 75: 100, 50: 100 }[
      res
    ] || 150
  );
}

function getOldGeneralization(resolution) {
  const res = getDataResolution(resolution);
  return { 750: 10, 500: 10, 250: 30, 100: 30 }[res] || 100;
}

export default { getDataResolution, getGeneralization, getOldGeneralization };
