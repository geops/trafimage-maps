import { useEffect } from "react";
import { useSelector } from "react-redux";
import useIsMobile from "./useHasScreenSize";
import panCenterFeature from "./panCenterFeature";
import highlightPointFeatures from "./highlightPointFeatures";
import defaultHighlightPointStyle from "./highlightPointStyle";

const useHighlightLayer = (featureInfo, featuresCandidate) => {
  const highlightLayer = useSelector((state) => state.map.highlightLayer);
  const map = useSelector((state) => state.app.map);
  const searchService = useSelector((state) => state.app.searchService);
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const isMobile = useIsMobile();
  const features = featuresCandidate || featureInfo?.features;

  useEffect(() => {
    // The featureInformation component can be display twice at the same time (in the popup and in the overlay).
    // So to avoid a js error we have to check if the layer is already on the map or not.
    if (
      map &&
      !map
        .getLayers()
        .getArray()
        .find((l) => l === highlightLayer)
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
          .find((l) => l === highlightLayer)
      ) {
        map.removeLayer(highlightLayer);
      }
    };
  }, [map, searchService, highlightLayer]);

  // When the featureIndex change we add the red circle then we pan on it.
  useEffect(() => {
    if (!features || !featureInfo) {
      // When the user click on map to get new feature info, the infoIndexed is
      // changed before the featureIndex. So the featureIndex is not reinitialized yet.
      // It will be on the next render. So we just ignore if there is no feature to display.
      return () => {};
    }
    const { layer, coordinate } = featureInfo;
    const layerHighlightPointStyle = layer.get("highlightPointStyle");
    highlightLayer.setStyle(
      layerHighlightPointStyle || defaultHighlightPointStyle,
    );
    highlightPointFeatures(features, layer, highlightLayer, coordinate);

    // Apply select feature state to mapboxStyleLayer features
    layer?.select?.(features);

    // We have to render the map otherwise the last selected features are displayed during animation.
    map.renderSync();

    // We want to recenter the map only if the coordinates clicked are under
    // the Overlay (mobile and desktop) or Menu element (only desktop).
    const coordinateClicked = coordinate;
    if (coordinateClicked) {
      panCenterFeature(
        map,
        [layer],
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
    }
    return () => {
      layer?.select?.();
    };
  }, [
    map,
    isMobile,
    menuOpen,
    highlightLayer,
    activeTopic,
    featureInfo,
    features,
  ]);
};

export default useHighlightLayer;
