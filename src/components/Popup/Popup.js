import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import RSPopup from 'react-spatial/components/Popup';
import DefaultPopup from './DefaultPopup';
import { setClickedFeatureInfo } from '../../model/app/actions';

const propTypes = {
  clickedFeatureInfo: PropTypes.shape(),
  popupComponents: PropTypes.objectOf(PropTypes.string),
  map: PropTypes.instanceOf(OLMap).isRequired,
  dispatchSetClickedFeatureInfo: PropTypes.func.isRequired,
};

const defaultProps = {
  clickedFeatureInfo: null,
  popupComponents: null,
};

const Popup = ({
  clickedFeatureInfo,
  map,
  popupComponents,
  dispatchSetClickedFeatureInfo,
}) => {
  if (!clickedFeatureInfo) {
    return null;
  }

  const { features, layer, event } = clickedFeatureInfo;
  const [feature] = features; // TODO: allow multiple
  const componentName = popupComponents[layer.getKey()];
  const PopupComponent = componentName
    ? React.lazy(() => import(`./${componentName}`))
    : DefaultPopup;

  return (
    <React.Suspense fallback="loading...">
      <RSPopup
        onCloseClick={() => dispatchSetClickedFeatureInfo()}
        popupCoordinate={event.coordinate}
        feature={feature}
        map={map}
      >
        <PopupComponent feature={feature} />
      </RSPopup>
    </React.Suspense>
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
