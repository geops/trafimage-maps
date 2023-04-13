/**
 * Convert Direktverbindungen features for popup
 */
const parseDvFeatures = (featuresArray) => {
  return featuresArray.map((feature) => {
    const {
      start_station_name: start,
      end_station_name: end,
      vias,
    } = feature.getProperties();

    const switchVias = vias
      ? (Array.isArray(vias) ? vias : JSON.parse(vias)).filter(
          (via) => via.via_type === 'switch' || via.via_type === 'visible',
        )
      : [];
    feature.set('vias', [
      { station_name: start },
      ...switchVias,
      { station_name: end },
    ]);
    return feature;
  });
};

export default parseDvFeatures;