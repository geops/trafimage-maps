import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import Point from 'ol/geom/Point';
import RSPopup from 'react-spatial/components/Popup';
import FeatureInformation from '../FeatureInformation';
import { setClickedFeatureInfo } from '../../model/app/actions';
import './Popup.scss';

const propTypes = {
  clickedFeatureInfo: PropTypes.arrayOf(PropTypes.shape()),
  popupComponents: PropTypes.objectOf(PropTypes.string).isRequired,
  map: PropTypes.instanceOf(OLMap).isRequired,
  dispatchSetClickedFeatureInfo: PropTypes.func.isRequired,
};

const defaultProps = {
  clickedFeatureInfo: null,
};

const Popup = ({
  map,
  popupComponents,
  clickedFeatureInfo,
  dispatchSetClickedFeatureInfo,
}) => {
  if (!clickedFeatureInfo || !clickedFeatureInfo.length) {
    return null;
  }

  const { coordinate, features } = clickedFeatureInfo[0];
  const geom = features[0].getGeometry();
  const coord = geom instanceof Point ? geom.getCoordinates() : coordinate;

  return (
    <RSPopup
      onCloseClick={() => dispatchSetClickedFeatureInfo()}
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
Popup.defaultProps = defaultProps;

const mapStateToProps = state => ({
  clickedFeatureInfo: state.app.clickedFeatureInfo,
});

const mapDispatchToProps = {
  dispatchSetClickedFeatureInfo: setClickedFeatureInfo,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Popup);
