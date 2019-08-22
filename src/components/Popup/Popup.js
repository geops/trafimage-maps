import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import RSPopup from 'react-spatial/components/Popup';
import { setClickedFeatureInfo } from '../../model/app/actions';

import './Popup.scss';

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

  const { features, layer, coordinate } = clickedFeatureInfo;
  const [feature] = features; // TODO: allow multiple
  const componentName = popupComponents[layer.getKey()];

  if (!componentName) {
    return null;
  }

  const PopupComponent = React.lazy(() =>
    // Styleguidist try to load every file in the folder if we don't put index.js
    import(`../../popups/${componentName}/index.js`),
  );

  return (
    <React.Suspense fallback="loading...">
      <RSPopup
        onCloseClick={() => dispatchSetClickedFeatureInfo()}
        popupCoordinate={coordinate}
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
