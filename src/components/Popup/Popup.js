import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Point from 'ol/geom/Point';
import RSPopup from 'react-spatial/components/Popup';
import FeatureInformation from '../FeatureInformation';
import { setClickedFeatureInfo } from '../../model/app/actions';
import './Popup.scss';

const propTypes = {
  elements: PropTypes.objectOf(PropTypes.bool).isRequired,
};

const Popup = ({ elements }) => {
  const map = useSelector(state => state.app.map);
  const clickedFeatureInfo = useSelector(state => state.app.clickedFeatureInfo);
  const dispatch = useDispatch();

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
  const mapRect = map.getTarget().getBoundingClientRect();

  return (
    <RSPopup
      onCloseClick={() => {
        dispatch(setClickedFeatureInfo());
      }}
      showHeader={false}
      padding="0px"
      panIntoView
      panRect={{
        top: mapRect.top + (elements.header ? 110 : 10),
        bottom: mapRect.bottom,
        left: mapRect.left + 10,
        right: mapRect.right - (elements.mapControls ? 70 : 10),
      }}
      popupCoordinate={coord}
      map={map}
    >
      <FeatureInformation clickedFeatureInfo={filtered} />
    </RSPopup>
  );
};

Popup.propTypes = propTypes;

export default React.memo(Popup);
