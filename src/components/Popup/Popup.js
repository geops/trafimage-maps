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
  popupComponents: PropTypes.objectOf(PropTypes.string),
  map: PropTypes.instanceOf(OLMap).isRequired,
  dispatchSetClickedFeatureInfo: PropTypes.func.isRequired,
};

const defaultProps = {
  clickedFeatureInfo: null,
  popupComponents: null,
};

class Popup extends Component {
  constructor(props) {
    super(props);
    const { clickedFeatureInfo } = this.props;

    this.state = {
      featIndex: 0,
      featuresList: clickedFeatureInfo ? clickedFeatureInfo.features : [],
    };

    if (clickedFeatureInfo) {
      this.setClickedFeatureInfo(clickedFeatureInfo);
    }
  }

  componentDidUpdate(prevProps) {
    const { clickedFeatureInfo } = this.props;

    if (clickedFeatureInfo !== prevProps.clickedFeatureInfo) {
      this.setFeaturesList(clickedFeatureInfo);
    }
  }

  setClickedFeatureInfo(clickedFeature) {
    const { popupComponents } = this.props;
    const { featIndex } = this.state;

    const { features, layer, coordinate } = clickedFeature;
    this.componentName = popupComponents[layer.getKey()];
    this.popupCoordinate =
      features.length && features[featIndex].getGeometry() instanceof Point
        ? features[featIndex].getGeometry().getCoordinates()
        : coordinate;
  }

  setFeaturesList(clickedFeature) {
    if (clickedFeature) {
      this.setClickedFeatureInfo(clickedFeature);
      this.setState({
        featIndex: 0,
        featuresList: clickedFeature.features,
      });
    } else {
      this.componentName = null;
      this.popupCoordinate = null;
      this.setState({
        featIndex: 0,
        featuresList: [],
      });
    }
  }

  renderPagination(feats) {
    const { t } = this.props;
    const { featIndex } = this.state;
    return (
      <div className="wkp-popup-pagination-wrapper">
        <span className="wkp-popup-pagination-button-wrapper">
          {featIndex > 0 ? (
            <Button
              className="wkp-popup-pagination-button"
              onClick={() => this.setState({ featIndex: featIndex - 1 })}
            >
              <IoIosArrowRoundBack />
            </Button>
          ) : null}
        </span>
        {featIndex + 1} {t('von')} {feats.length}
        <span className="wkp-popup-pagination-button-wrapper">
          {featIndex + 1 < feats.length ? (
            <Button
              className="wkp-popup-pagination-button"
              onClick={() => this.setState({ featIndex: featIndex + 1 })}
            >
              <IoIosArrowRoundForward />
            </Button>
          ) : null}
        </span>
      </div>
    );
  }

  render() {
    const { map, dispatchSetClickedFeatureInfo } = this.props;
    const { featIndex, featuresList } = this.state;
    if (!featuresList.length) {
      return null;
    }

    // Styleguidist try to load every file in the folder if we don't put index.js
    const PopupComponent = React.lazy(() =>
      import(`../../popups/${this.componentName}/index.js`),
    );

    return (
      <React.Suspense fallback="loading...">
        <RSPopup
          onCloseClick={() => dispatchSetClickedFeatureInfo()}
          popupCoordinate={this.popupCoordinate}
          map={map}
        >
          <PopupComponent feature={featuresList[featIndex]} />
          {featuresList.length > 1 ? this.renderPagination(featuresList) : null}
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
