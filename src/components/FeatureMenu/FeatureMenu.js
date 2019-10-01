import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import { FaInfo } from 'react-icons/fa';
import Map from 'ol/Map';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import { setMenuOpen } from '../../model/app/actions';
import FeaturePagination from '../FeaturePagination';
import { transitiondelay } from '../../Globals.scss';
import MenuItem from '../Menu/MenuItem';

const propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  icon: PropTypes.element,
  renderBody: PropTypes.func.isRequired,

  // mapStateToProps
  menuOpen: PropTypes.bool.isRequired,
  clickedFeatureInfo: PropTypes.shape(),

  // mapDispatchToProps
  dispatchSetMenuOpen: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {
  className: null,
  icon: <FaInfo />,
  clickedFeatureInfo: null,
};

class FeatureMenu extends Component {
  constructor(props) {
    super(props);
    const { map, clickedFeatureInfo } = this.props;
    this.elementRef = React.createRef();

    this.state = {
      open: !!clickedFeatureInfo || false,
      collapsed: true,
      featureIndex: 0,
    };

    // Layer with a higher zIndex, to display clicked feature above other layers.
    this.highlightedLayer = new OLVectorLayer({
      source: new OLVectorSource(),
      zIndex: 1,
    });

    map.on('change:size', () => {
      this.updateMenuHeight();
    });
  }

  componentDidUpdate(prevProps) {
    const { menuOpen, clickedFeatureInfo, dispatchSetMenuOpen } = this.props;
    if (clickedFeatureInfo !== prevProps.clickedFeatureInfo) {
      if (clickedFeatureInfo && clickedFeatureInfo.features.length) {
        dispatchSetMenuOpen(false);
      }
      this.updateMenu();
    }

    if (menuOpen !== prevProps.menuOpen) {
      window.setTimeout(() => {
        this.updateMenuHeight();
      }, transitiondelay);
    }
  }

  componentWillUnmount() {
    this.highlightedLayer.setMap(null);
  }

  updateMenuHeight() {
    const { map } = this.props;
    let menuHeight;
    if (this.elementRef && this.elementRef.current) {
      const mapBottom = map.getTarget().getBoundingClientRect().bottom;
      const elemRect = this.elementRef.current.getBoundingClientRect();
      menuHeight = mapBottom - elemRect.top - 35;
    }

    this.setState({ menuHeight });
  }

  highlightFeature(idx) {
    const { clickedFeatureInfo } = this.props;

    this.highlightedLayer.setStyle(
      clickedFeatureInfo.layers[idx].olLayer.getStyle(),
    );
    this.highlightedLayer.getSource().clear();
    this.highlightedLayer
      .getSource()
      .addFeature(clickedFeatureInfo.features[idx]);
  }

  updateMenu() {
    const { featureIndex } = this.state;
    const { map, clickedFeatureInfo } = this.props;
    const feature =
      clickedFeatureInfo && clickedFeatureInfo.features[featureIndex];

    this.setState({
      featureIndex: 0,
      open: feature ? clickedFeatureInfo.layers[featureIndex].getName() : false,
      collapsed: false,
    });

    if (feature) {
      this.highlightedLayer.setMap(map);
      this.highlightFeature(0);
    } else {
      this.highlightedLayer.setMap(null);
    }
  }

  renderpagination() {
    const { featureIndex } = this.state;
    const { clickedFeatureInfo } = this.props;
    const { features } = clickedFeatureInfo;

    if (features.length > 1) {
      return (
        <FeaturePagination
          featureIndex={featureIndex}
          features={features}
          setFeatureIndex={idx => {
            this.setState({ featureIndex: idx });
            this.highlightFeature(idx);
            window.setTimeout(() => {
              this.updateMenuHeight();
            }, transitiondelay);
          }}
        />
      );
    }
    return null;
  }

  render() {
    const { open, collapsed, featureIndex } = this.state;
    const {
      title,
      className,
      icon,
      renderBody,
      t,
      map,
      clickedFeatureInfo,
    } = this.props;
    const { menuHeight } = this.state;
    if (!open) {
      return null;
    }

    return (
      <MenuItem
        className={`wkp-feature-menu${className ? ` ${className}` : ''}`}
        title={t(title)}
        icon={icon}
        map={map}
        open={typeof open === 'string'}
        collapsed={collapsed}
        onCollapseToggle={c => {
          this.setState({ collapsed: c });
          window.setTimeout(() => {
            this.updateMenuHeight();
          }, transitiondelay);
        }}
      >
        {clickedFeatureInfo && clickedFeatureInfo.features.length ? (
          <div ref={this.elementRef}>
            {renderBody(
              featureIndex,
              clickedFeatureInfo.features,
              menuHeight,
              clickedFeatureInfo.features.length > 1,
            )}
            {this.renderpagination()}
          </div>
        ) : null}
      </MenuItem>
    );
  }
}

const mapStateToProps = state => ({
  menuOpen: state.app.menuOpen,
  clickedFeatureInfo: state.app.clickedFeatureInfo,
});

const mapDispatchToProps = {
  dispatchSetMenuOpen: setMenuOpen,
};

FeatureMenu.propTypes = propTypes;
FeatureMenu.defaultProps = defaultProps;

export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(FeatureMenu);
