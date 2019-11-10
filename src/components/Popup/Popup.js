import React from 'react';
import { useSelector } from 'react-redux';
import Point from 'ol/geom/Point';
import RSPopup from 'react-spatial/components/Popup';
import FeatureInformation from '../FeatureInformation';
import './Popup.scss';

const Popup = () => {
  const map = useSelector(state => state.app.map);
  const clickedFeatureInfo = useSelector(state => state.app.clickedFeatureInfo);

  if (!clickedFeatureInfo || !clickedFeatureInfo.length) {
    return null;
  }

  const filtered = clickedFeatureInfo.filter(({ layer }) =>
    layer.get('popupComponent'),
  );

  if (!filtered.length) {
    return null;
  }

  const { coordinate, features } = clickedFeatureInfo[0];
  const geom = features[0].getGeometry();
  const coord = geom instanceof Point ? geom.getCoordinates() : coordinate;

  return (
    <RSPopup showHeader={false} padding="0px" popupCoordinate={coord} map={map}>
      <FeatureInformation clickedFeatureInfo={filtered} />
    </RSPopup>
  );
};

export default React.memo(Popup);
