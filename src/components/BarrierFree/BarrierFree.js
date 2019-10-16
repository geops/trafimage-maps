import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { containsExtent } from 'ol/extent';
import WKT from 'ol/format/WKT';
import getFeatureGeometry from '../../utils/getFeatureGeometry';

const focusClass = 'wkp-bf-focus';
let tabFeature = false;
let featLayer = null;
let visibleLayers = [];
let visibleFeatures = [];
let featureIndex = -1;

function BarrierFree() {
  const zoom = useSelector(state => state.map.zoom);
  const center = useSelector(state => state.map.center);
  const resolution = useSelector(state => state.map.resolution);

  const map = useSelector(state => state.app.map);
  const layerService = useSelector(state => state.app.layerService);

  // Filtering function based on generalization levels.
  const wktFormat = new WKT();
  const filterFeat = feature => {
    const geometry = getFeatureGeometry(feature, resolution, wktFormat);

    if (!geometry || feature.get('visibility') < resolution * 10) {
      return false;
    }
    return true;
  };

  const removeHighlight = () => {
    // Remove feature highlight
    if (featLayer) {
      featLayer.clickedFeature = null;
      featLayer.olLayer.changed();
    }
    tabFeature = false;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setVisibleFeats = () => {
    visibleLayers = layerService
      .getLayersAsFlatArray()
      .reverse()
      .filter(l => !l.getIsBaseLayer() && l.getVisible());

    const mapExtent = map.getView().calculateExtent(map.getSize());

    let visFeats = [];
    visibleLayers.forEach(l => {
      if (l && l.olLayer) {
        const features = l.olLayer.getSource().getFeatures();
        if (features.length > 0) {
          features.forEach(f => f.set('layerRef', l));
          const visibleFeats = features.filter(
            feat =>
              containsExtent(mapExtent, feat.getGeometry().getExtent()) &&
              filterFeat(feat),
          );
          // Check if visible on the map
          visFeats = visFeats.concat(visibleFeats);
        }
      }
    });
    visFeats.sort((a, b) => {
      if (
        a.getGeometry().getCoordinates()[0] <
        b.getGeometry().getCoordinates()[0]
      ) {
        return -1;
      }
      return 1;
    });
    visibleFeatures = visFeats;
  };

  const focusFeature = () => {
    const featToFocus = visibleFeatures[featureIndex];
    featLayer = featToFocus ? featToFocus.get('layerRef') : null;
    if (featLayer) {
      tabFeature = true;
      featLayer.clickedFeature = featToFocus;
      featLayer.olLayer.changed();
    }
  };

  const onFocus = () => {
    setVisibleFeats();
    tabFeature = true;
    featureIndex = featureIndex || -1;
    focusFeature();
  };

  const onKeyUp = e => {
    const forward = !e.shiftKey;
    if (!tabFeature) {
      document.body.classList.add(focusClass);
    } else {
      featureIndex += forward ? 1 : -1;

      if (forward && featureIndex >= visibleFeatures.length) {
        removeHighlight();
      } else if (!forward && featureIndex <= -1) {
        removeHighlight();
        featureIndex = -1;
      } else {
        focusFeature();
      }
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onDocumentClick = () => {
    // Remov bf class from the document body.
    document.body.classList.remove(focusClass);
    // Reset value to default.
    tabFeature = false;
  };

  const onDocumentKeyUp = e => {
    if (e.keyCode === 9) {
      onKeyUp(e);
    }
    if ([38, 40].includes(e.keyCode)) {
      onKeyUp(e, document.activeElement);
    }
  };

  const onDocumentKeyDown = e => {
    if (e.keyCode === 9) {
      const forward = !e.shiftKey;
      if (
        !tabFeature ||
        (forward && featureIndex >= visibleFeatures.length) ||
        (!forward && featureIndex <= -1)
      ) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    setVisibleFeats();
  }, [center, zoom, resolution, layerService, setVisibleFeats]);

  useEffect(() => {
    // ComponentDidMount
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keyup', onDocumentKeyUp);
    document.addEventListener('keydown', onDocumentKeyDown);
    // ComponentWillUnmount
    return () => {
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keyup', onDocumentKeyUp);
      document.removeEventListener('keydown', onDocumentKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="button"
      label="barrierfree"
      tabIndex="0"
      onFocus={() => {
        onFocus();
      }}
    />
  );
}

export default BarrierFree;
