import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Point from 'ol/geom/Point';
import RSPopup from 'react-spatial/components/Popup';
import FeatureInformation from '../FeatureInformation';
import { setClickedFeatureInfo } from '../../model/app/actions';
import './Popup.scss';

const propTypes = {
  popupComponents: PropTypes.objectOf(PropTypes.string).isRequired,
};

const Popup = ({ popupComponents }) => {
  const map = useSelector(state => state.app.map);
  const clickedFeatureInfo = useSelector(state => state.app.clickedFeatureInfo);
  const dispatch = useDispatch();

  if (!clickedFeatureInfo || !clickedFeatureInfo.length) {
    return null;
  }

  const filtered = clickedFeatureInfo.filter(
    ({ layer }) => !!popupComponents[layer.getKey()],
  );

  if (!filtered.length) {
    return null;
  }

  const { coordinate, features } = clickedFeatureInfo[0];
  const geom = features[0].getGeometry();
  const coord = geom instanceof Point ? geom.getCoordinates() : coordinate;

  return (
    <RSPopup
      onCloseClick={() => {
        dispatch(setClickedFeatureInfo());
      }}
      popupCoordinate={coord}
      map={map}
    >
      <FeatureInformation
        popupComponents={popupComponents}
        clickedFeatureInfo={filtered}
      />
    </RSPopup>
  );
};

Popup.propTypes = propTypes;

export default React.memo(Popup);
