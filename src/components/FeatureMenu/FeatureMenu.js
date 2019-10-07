import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import { FaInfo } from 'react-icons/fa';
import Map from 'ol/Map';
import FeatureInformation from '../FeatureInformation';
import MenuItem from '../Menu/MenuItem';

const propTypes = {
  clickedFeatureInfo: PropTypes.arrayOf(PropTypes.shape()),
  popupComponents: PropTypes.objectOf(PropTypes.string).isRequired,
  map: PropTypes.instanceOf(Map).isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {
  clickedFeatureInfo: [],
};

const FeatureMenu = ({ clickedFeatureInfo, map, popupComponents, t }) => {
  const [collapsed, setCollapsed] = useState(false);

  if (!clickedFeatureInfo || !clickedFeatureInfo.length) {
    return null;
  }

  return (
    <MenuItem
      className="wkp-feature-menu"
      title={t('Detailinformationen')}
      icon={<FaInfo />}
      map={map}
      open
      collapsed={collapsed}
      onCollapseToggle={c => setCollapsed(c)}
    >
      <FeatureInformation
        clickedFeatureInfo={clickedFeatureInfo}
        popupComponents={popupComponents}
      />
    </MenuItem>
  );
};

const mapStateToProps = state => ({
  clickedFeatureInfo: state.app.clickedFeatureInfo,
});

FeatureMenu.propTypes = propTypes;
FeatureMenu.defaultProps = defaultProps;

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(FeatureMenu);
