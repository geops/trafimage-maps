/**
 * Convert Direktverbindungen features for popup
 */
const parseDvFeatures = (featuresArray) => {
  return featuresArray.map((feature) => {
    const { vias } = feature.getProperties();
    const parsedVias = Array.isArray(vias) ? vias : JSON.parse(vias);

    const switchVias = vias
      ? parsedVias.filter(
          (via) => via.via_type === "switch" || via.via_type === "visible",
        )
      : [];
    feature.set("vias", [
      parsedVias[0],
      ...switchVias,
      parsedVias[parsedVias.length - 1],
    ]);
    return feature;
  });
};

export default parseDvFeatures;
