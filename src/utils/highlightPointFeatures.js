import { Feature } from "ol";
import { Point } from "ol/geom";

/**
 * TODO highlightPointFeatureFilter and getHighlightGeometry seems never used anymore in the codebase.
 * TODO silent parameter seems also never be used
 * could we remove them?
 */
const highlightPointFeatures = (
  features,
  layer,
  highlightLayer,
  coordinate,
  silent, // Used to prevent state updates in popup components (e.g. DvLineInfo, DvFeatureInfo)
) => {
  highlightLayer.getSource().clear();
  const filtered =
    !silent && layer.get("highlightPointFeatureFilter")
      ? features.filter((feat) =>
          layer.get("highlightPointFeatureFilter")(feat, layer),
        )
      : features;
  filtered.forEach((feat) => {
    if (feat && feat.getGeometry()) {
      const layerHighlightGeom =
        layer.get("getHighlightGeometry") &&
        layer.get("getHighlightGeometry")(feat, layer, coordinate);

      if (feat.getGeometry().getType() === "Point") {
        highlightLayer.getSource().addFeature(
          new Feature({
            ...feat.getProperties(),
            geometry: layerHighlightGeom || feat.getGeometry(),
            silent,
          }),
        );
      } else {
        // In case mapbox render an icon for a polygon or a line we display
        // the highlight style on the coordinate clicked.
        // Needed for platforms layer.
        const { layer: mbLayer } = feat.get("mapboxFeature") || {};
        const defaultHighlightGeom =
          mbLayer &&
          mbLayer.layout &&
          mbLayer.layout["icon-image"] &&
          new Point(coordinate);

        if (layerHighlightGeom || defaultHighlightGeom) {
          highlightLayer.getSource().clear();
          highlightLayer.getSource().addFeature(
            new Feature({
              ...feat.getProperties(),
              geometry: layerHighlightGeom || defaultHighlightGeom,
              silent,
            }),
          );
        }
      }
    }
  });
};

export default highlightPointFeatures;
