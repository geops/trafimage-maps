import { useEffect } from "react";
import { useSelector } from "react-redux";
import useIndexedFeatureInfo from "./useIndexedFeatureInfo";
import useIsMobile from "./useIsMobile";
import panCenterFeature from "./panCenterFeature";
import highlightPointFeatures from "./highlightPointFeatures";
import defaultHighlightPointStyle from "./highlightPointStyle";

const useHighlightLayer = (featureInfo, highlightLayer, featureIndex = 0) => {
  const map = useSelector((state) => state.app.map);
  const searchService = useSelector((state) => state.app.searchService);
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const activeTopic = useSelector((state) => state.app.activeTopic);
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
      highlightLayer.setStyle(defaultHighlightPointStyle);

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
  }, [map, searchService, highlightLayer, infoIndexed]);
  // When the featureIndex change we add the red circle then we pan on it.
  useEffect(() => {
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
    const layerHighlightPointStyle = layerr.get("highlightPointStyle");
    highlightLayer.setStyle(
      layerHighlightPointStyle || defaultHighlightPointStyle,
    );
    highlightPointFeatures(features, layerr, highlightLayer, coordinates);

    // We have to render the map otherwise the last selected features are displayed during animation.
    map.renderSync();

    // We want to recenter the map only if the coordinates clicked are under
    // the Overlay (mobile and desktop) or Menu element (only desktop).
    const coordinateClicked = coordinates[0];
    if (!coordinateClicked) {
      return;
    }
    panCenterFeature(
      map,
      [layerr],
      coordinateClicked,
      menuOpen,
      isMobile,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      activeTopic?.overlaySide,
    );
  }, [
    map,
    isMobile,
    featureIndex,
    infoIndexed,
    menuOpen,
    highlightLayer,
    activeTopic,
  ]);
};

export default useHighlightLayer;
