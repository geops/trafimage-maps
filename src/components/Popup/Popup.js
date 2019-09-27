import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import Point from 'ol/geom/Point';
import RSPopup from 'react-spatial/components/Popup';
import FeaturePagination from '../FeaturePagination';
import { setClickedFeatureInfo } from '../../model/app/actions';
import './Popup.scss';

const propTypes = {
  clickedFeatureInfo: PropTypes.shape(),
  popupComponents: PropTypes.objectOf(PropTypes.string).isRequired,
  map: PropTypes.instanceOf(OLMap).isRequired,
  dispatchSetClickedFeatureInfo: PropTypes.func.isRequired,
};

const defaultProps = {
  clickedFeatureInfo: null,
};

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featureIndex: 0,
    };
  }

  componentDidUpdate(prevProps) {
    const { clickedFeatureInfo } = this.props;

    if (clickedFeatureInfo !== prevProps.clickedFeatureInfo) {
      this.resetFeatureIndex();
    }
  }

  resetFeatureIndex() {
    this.setState({
      featureIndex: 0,
    });
  }

  renderPagination(features) {
    const { featureIndex } = this.state;
    return (
      <FeaturePagination
        featureIndex={featureIndex}
        features={features}
        setFeatureIndex={idx => this.setState({ featureIndex: idx })}
      />
    );
  }

  render() {
    const {
      map,
      popupComponents,
      clickedFeatureInfo,
      dispatchSetClickedFeatureInfo,
    } = this.props;

    if (!clickedFeatureInfo || !clickedFeatureInfo.features.length) {
      return null;
    }

    const { featureIndex } = this.state;
    const { features, coordinate, layer } = clickedFeatureInfo;
    const feature = features[featureIndex];

    if (!popupComponents[layer.getKey()]) {
      return null;
    }

    // Styleguidist try to load every file in the folder if we don't put index.js
    const PopupComponent = React.lazy(() =>
      import(`../../popups/${popupComponents[layer.getKey()]}/index.js`),
    );

    const popupCoordinate =
      feature.getGeometry() instanceof Point
        ? feature.getGeometry().getCoordinates()
        : coordinate;

    return (
      <React.Suspense fallback="loading...">
        <RSPopup
          onCloseClick={() => dispatchSetClickedFeatureInfo()}
          popupCoordinate={popupCoordinate}
          map={map}
        >
          <PopupComponent feature={features[featureIndex]} />
          {clickedFeatureInfo.features.length > 1
            ? this.renderPagination(features)
            : null}
        </RSPopup>
      </React.Suspense>
    );
  }
}

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
