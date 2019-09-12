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
      featIndex: 0,
      componentName: null,
      popupCoordinate: null,
    };
  }

  componentDidMount() {
    const { clickedFeatureInfo } = this.props;
    if (clickedFeatureInfo) {
      this.updatePopup(clickedFeatureInfo);
    }
  }

  componentDidUpdate(prevProps) {
    const { clickedFeatureInfo } = this.props;
    if (clickedFeatureInfo !== prevProps.clickedFeatureInfo) {
      this.updatePopup();
    }
  }

  updatePopup() {
    const { popupComponents, clickedFeatureInfo } = this.props;
    const { featIndex } = this.state;

    if (clickedFeatureInfo) {
      const { features, layer, coordinate } = clickedFeatureInfo;
      this.setState({
        featIndex: 0,
        componentName: popupComponents[layer.getKey()],
        popupCoordinate:
          features.length && features[featIndex].getGeometry() instanceof Point
            ? features[featIndex].getGeometry().getCoordinates()
            : coordinate,
      });
    } else {
      this.setState({
        featIndex: 0,
        componentName: null,
        popupCoordinate: null,
      });
    }
  }

  renderPagination(features) {
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
        {featIndex + 1} {t('von')} {features.length}
        <span className="wkp-popup-pagination-button-wrapper">
          {featIndex + 1 < features.length ? (
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
    const {
      map,
      clickedFeatureInfo,
      dispatchSetClickedFeatureInfo,
    } = this.props;
    const { featIndex, popupCoordinate, componentName } = this.state;
    if (
      !clickedFeatureInfo ||
      !clickedFeatureInfo.features.length ||
      !componentName
    ) {
      return null;
    }

    // Styleguidist try to load every file in the folder if we don't put index.js
    const PopupComponent = React.lazy(() =>
      import(`../../popups/${componentName}/index.js`),
    );

    return (
      <React.Suspense fallback="loading...">
        <RSPopup
          onCloseClick={() => dispatchSetClickedFeatureInfo()}
          popupCoordinate={popupCoordinate}
          map={map}
        >
          <PopupComponent feature={clickedFeatureInfo.features[featIndex]} />
          {clickedFeatureInfo.features.length > 1
            ? this.renderPagination(clickedFeatureInfo.features)
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
