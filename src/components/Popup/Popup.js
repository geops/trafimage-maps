import React from 'react';
import { useSelector } from 'react-redux';
import { Point, LineString } from 'ol/geom';
import RSPopup from 'react-spatial/components/Popup';
import FeatureInformation from '../FeatureInformation';

const getPopupCoordinates = (
  map,
  feature,
  coordinate,
  geometry,
  customFunction,
) => {
  if (customFunction) {
    return customFunction(feature, map);
  }

  if (geometry) {
    return geometry.getClosestPoint(coordinate);
  }

  return coordinate;
};

const Popup = () => {
  const map = useSelector((state) => state.app.map);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const showPopups = useSelector((state) => state.app.showPopups);
  let featureInfo = useSelector((state) => state.app.featureInfo);

  if (!featureInfo || !featureInfo.length || !showPopups) {
    return null;
  }

  if (activeTopic.modifyFeatureInfo) {
    featureInfo = activeTopic.modifyFeatureInfo(featureInfo);
  }

  const filtered = featureInfo.filter((info) => {
    const { layer, features } = info;

    if (
      layer.get('popupComponent') &&
      !layer.get('useOverlay') &&
      !layer.get('useMenu') &&
      !layer.get('useTrackerMenu')
    ) {
      if (typeof layer.hidePopup === 'function') {
        return features.find((f) => !layer.hidePopup(f, layer, featureInfo));
      }
      return true;
    }
    return false;
  });

  if (!filtered.length) {
    return null;
  }

  const { coordinate, features } = featureInfo[0];
  const geom = features[0].getGeometry();
  let coord = getPopupCoordinates(
    map,
    features[0],
    coordinate,
    undefined,
    activeTopic.popupConfig && activeTopic.popupConfig.getPopupCoordinates,
  );

  if (
    coordinate &&
    features.length === 1 &&
    (geom instanceof Point || geom instanceof LineString)
  ) {
    coord = getPopupCoordinates(map, features[0], coordinate, geom);
  }

  const mapRect = map.getTarget().getBoundingClientRect();

  // do not move the popup over the map controls except on small screens
  const paddingRight =
    activeTopic.elements.mapControls && mapRect.width > 450 ? 70 : 10;

  return (
    <RSPopup
      renderHeader={() => {}}
      padding="0px"
      panIntoView={
        !(
          activeTopic.popupConfig &&
          activeTopic.popupConfig.panIntoView === false
        )
      }
      panRect={{
        top: mapRect.top + (activeTopic.elements.header ? 110 : 10),
        bottom: mapRect.bottom,
        left: mapRect.left + 10,
        right: mapRect.right - paddingRight,
      }}
      popupCoordinate={coord}
      map={map}
    >
      <FeatureInformation featureInfo={filtered} />
    </RSPopup>
  );
};

export default React.memo(Popup);
