const dataResolutions = [750, 500, 250, 100, 75, 50, 20, 10, 5];

function getDataResolution(resolution, resolutions = dataResolutions) {
  return resolutions.reduce((prev, curr) => {
    return Math.abs(curr - resolution) < Math.abs(prev - resolution)
      ? curr
      : prev;
  });
}

function getGeneralization(resolution, resolutions, generalisations) {
  const res = getDataResolution(resolution, resolutions);

  return (
    (generalisations || {
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

export default { getDataResolution, getGeneralization, getOldGeneralization };
