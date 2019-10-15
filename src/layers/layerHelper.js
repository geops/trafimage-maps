const dataResolutions = [750, 500, 250, 100, 50, 20, 10, 5];

function getDataResolution(resolution) {
  return dataResolutions.reduce((prev, curr) =>
    Math.abs(curr - resolution) < Math.abs(prev - resolution) ? curr : prev,
  );
}

export default { getDataResolution };
