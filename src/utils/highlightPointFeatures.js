import GeometryType from 'ol/geom/GeometryType';
import { Feature } from 'ol';
import { Point } from 'ol/geom';

const highlightPointFeatures = (
  features,
  layer,
  highlightLayer,
  coordinatesArray,
) => {
  features.forEach((feat, idx) => {
    if (feat && feat.getGeometry()) {
      const layerHighlightGeom =
        layer.get('getHighlightGeometry') &&
        layer.get('getHighlightGeometry')(feat, layer, coordinatesArray[idx]);
      if (feat.getGeometry().getType() === GeometryType.POINT) {
        highlightLayer.getSource().clear();
        highlightLayer.getSource().addFeature(
          new Feature({
            ...feat.getProperties(),
            geometry: layerHighlightGeom || feat.getGeometry(),
          }),
        );
      } else {
        // In case mapbox render an icon for a polygon or a line we display
        // the highlight style on the coordinate clicked.
        // Needed for platforms layer.
        const { layer: mbLayer } = feat.get('mapboxFeature') || {};
        const defaultHighlightGeom =
          mbLayer &&
          mbLayer.layout &&
          mbLayer.layout['icon-image'] &&
          new Point(coordinatesArray[idx]);

        if (layerHighlightGeom || defaultHighlightGeom) {
          highlightLayer.getSource().clear();
          highlightLayer.getSource().addFeature(
            new Feature({
              ...feat.getProperties(),
              geometry: layerHighlightGeom || defaultHighlightGeom,
            }),
          );
        }
      }
    }
  });
};

export default highlightPointFeatures;
