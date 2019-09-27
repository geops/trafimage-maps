import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import { FaInfo } from 'react-icons/fa';
import Map from 'ol/Map';
import { setMenuOpen } from '../../model/app/actions';
import FeaturePagination from '../FeaturePagination';
import MenuItem from '../Menu/MenuItem';

const propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  icon: PropTypes.element,
  renderBody: PropTypes.func.isRequired,

  // mapStateToProps
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
    const { clickedFeatureInfo } = this.props;

    this.state = {
      open: !!clickedFeatureInfo || false,
      collapsed: true,
      featureIndex: 0,
    };
  }

  componentDidUpdate(prevProps) {
    const { clickedFeatureInfo, dispatchSetMenuOpen } = this.props;
    if (clickedFeatureInfo !== prevProps.clickedFeatureInfo) {
      if (clickedFeatureInfo && clickedFeatureInfo.features.length) {
        dispatchSetMenuOpen(false);
      }
      this.updateMenu();
    }
  }

  updateMenu() {
    const { featureIndex } = this.state;
    const { clickedFeatureInfo } = this.props;
    const feature =
      clickedFeatureInfo && clickedFeatureInfo.features[featureIndex];

    this.setState({
      featureIndex: 0,
      open: feature ? clickedFeatureInfo.layer.getName() : false,
      collapsed: false,
    });
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
          setFeatureIndex={idx => this.setState({ featureIndex: idx })}
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
        onCollapseToggle={c => this.setState({ collapsed: c })}
      >
        {clickedFeatureInfo && clickedFeatureInfo.features.length ? (
          <>
            {renderBody(featureIndex, clickedFeatureInfo.features)}
            {this.renderpagination()}
          </>
        ) : null}
      </MenuItem>
    );
  }
}

const mapStateToProps = state => ({
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
