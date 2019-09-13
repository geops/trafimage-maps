import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import OLMap from 'ol/Map';
import Point from 'ol/geom/Point';
import Button from 'react-spatial/components/Button';
import RSPopup from 'react-spatial/components/Popup';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { setClickedFeatureInfo } from '../../model/app/actions';
import './Popup.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
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
    const { t } = this.props;
    const { featureIndex } = this.state;
    return (
      <div className="wkp-popup-pagination-wrapper">
        <span className="wkp-popup-pagination-button-wrapper">
          {featureIndex > 0 ? (
            <Button
              className="wkp-popup-pagination-button"
              onClick={() => this.setState({ featureIndex: featureIndex - 1 })}
            >
              <IoIosArrowRoundBack />
            </Button>
          ) : null}
        </span>
        {featureIndex + 1} {t('von')} {features.length}
        <span className="wkp-popup-pagination-button-wrapper">
          {featureIndex + 1 < features.length ? (
            <Button
              className="wkp-popup-pagination-button"
              onClick={() => this.setState({ featureIndex: featureIndex + 1 })}
            >
              <IoIosArrowRoundForward />
            </Button>
          ) : null}
        </span>
      </div>
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
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Popup);
