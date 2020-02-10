function meterFormat(coords) {
  const coordStr = coords.map(num =>
    Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "'"),
  );

  return coordStr;
}

function wgs84Format(coords, decimalSep = '.') {
  return coords.map(num => num.toFixed(5).replace('.', decimalSep));
}

export default { meterFormat, wgs84Format };
