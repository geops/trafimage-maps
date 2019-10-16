export default function getFeatureGeometry(feature, resolution, wktFormat) {
  let geometry = feature.getGeometry();
  let gen = 100;
  gen = resolution < 500 ? 30 : gen;
  gen = resolution < 100 ? 10 : gen;
  gen = resolution < 200 ? null : gen;

  if (gen) {
    const wkt = (feature.get('generalizations') || {})[`geom_gen${gen}`];
    geometry = wkt ? wktFormat.readGeometry(wkt.split(';')[1]) : null;
  }
  return geometry;
}
