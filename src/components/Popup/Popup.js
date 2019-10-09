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
  const { map, clickedFeatureInfo } = useSelector(state => state.app);
  const dispatch = useDispatch();

  if (!clickedFeatureInfo || !clickedFeatureInfo.length) {
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
        clickedFeatureInfo={clickedFeatureInfo}
      />
    </RSPopup>
  );
};

Popup.propTypes = propTypes;

export default React.memo(Popup);
