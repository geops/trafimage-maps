import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import GeometryType from 'ol/geom/GeometryType';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import useIndexedFeatureInfo from './useIndexedFeatureInfo';
import useIsMobile from './useIsMobile';
import panCenterFeature from './panCenterFeature';

const useHighlightLayer = (featureInfo, highlightLayer, featureIndex = 0) => {
  const map = useSelector((state) => state.app.map);
  const searchService = useSelector((state) => state.app.searchService);
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const infoIndexed = useIndexedFeatureInfo(featureInfo);
  const isMobile = useIsMobile();

  useEffect(() => {
    // The featureInformation component can be display twice at the same time (in the popup and in the overlay).
    // So to avoid a js error we have to check if the layer is already on the map or not.
    if (
      map &&
      !map
        .getLayers()
        .getArray()
        .find((layer) => layer === highlightLayer)
    ) {
      map.addLayer(highlightLayer);
      // Clear the highlight for search
      if (searchService) {
        searchService.clearHighlight();
      }
    }

    return () => {
      highlightLayer.getSource().clear();

      if (
        map &&
        map
          .getLayers()
          .getArray()
          .find((layer) => layer === highlightLayer)
      ) {
        map.removeLayer(highlightLayer);
      }
    };
  }, [map, searchService, highlightLayer]);
  // When the featureIndex change we add the red circle then we pan on it.
  useEffect(() => {
    highlightLayer.getSource().clear();

    // 'feature' can be a feature or an array
    const feature = infoIndexed.features[featureIndex];
    if (!feature) {
      // When the user click on map to get new feature info, the infoIndexed is
      // changed before the featureIndex. So the featureIndex is not reinitialized yet.
      // It will be on the next render. So we just ignore if there is no feature to display.
      return;
    }
    const features = Array.isArray(feature) ? feature : [feature];
    const layerr = Array.isArray(infoIndexed.layers[featureIndex])
      ? infoIndexed.layers[featureIndex][0]
      : infoIndexed.layers[featureIndex];
    const coordinate = infoIndexed.coordinates[featureIndex];
    const coordinates = Array.isArray((coordinate || [])[0])
      ? coordinate
      : [coordinate];
    features.forEach((feat, idx) => {
      if (feat && feat.getGeometry()) {
        const layerHighlightGeom =
          layerr.get('getHighlightGeometry') &&
          layerr.get('getHighlightGeometry')(feat, layerr, coordinates[idx]);
        if (feat.getGeometry().getType() === GeometryType.POINT) {
          highlightLayer
            .getSource()
            .addFeature(new Feature(layerHighlightGeom || feat.getGeometry()));
        } else {
          // In case mapbox render an icon for a polygon or a line we display
          // the highlight style on the coordinate clicked.
          // Needed for platforms layer.
          const { layer: mbLayer } = feat.get('mapboxFeature') || {};
          const defaultHighlightGeom =
            mbLayer &&
            mbLayer.layout &&
            mbLayer.layout['icon-image'] &&
            new Point(coordinates[idx]);

          if (layerHighlightGeom || defaultHighlightGeom) {
            highlightLayer
              .getSource()
              .addFeature(
                new Feature(layerHighlightGeom || defaultHighlightGeom),
              );
          }
        }
      }
    });

    // We have to render the map otherwise the last selected features are displayed during animation.
    map.renderSync();

    // We want to recenter the map only if the coordinates clicked are under
    // the Overlay (mobile and desktop) or Menu element (only desktop).
    const coordinateClicked = coordinates[0];
    if (!coordinateClicked) {
      return;
    }
    panCenterFeature(map, [layerr], coordinateClicked, menuOpen, isMobile);
  }, [map, isMobile, featureIndex, infoIndexed, menuOpen, highlightLayer]);
};

export default useHighlightLayer;
