import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FaInfo } from 'react-icons/fa';
import FeatureInformation from '../FeatureInformation';
import MenuItem from '../Menu/MenuItem';

const propTypes = {
  staticFilesUrl: PropTypes.string,
};

const defaultProps = {
  staticFilesUrl: null,
};

const FeatureMenu = ({ staticFilesUrl }) => {
  const { t } = useTranslation();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const [collapsed, setCollapsed] = useState(false);

  if (!featureInfo || !featureInfo.length) {
    return null;
  }

  return (
    <MenuItem
      className="wkp-feature-menu"
      title={t('Detailinformationen')}
      icon={<FaInfo />}
      open
      collapsed={collapsed}
      onCollapseToggle={(c) => setCollapsed(c)}
    >
      <FeatureInformation
        featureInfo={featureInfo}
        staticFilesUrl={staticFilesUrl}
      />
    </MenuItem>
  );
};

FeatureMenu.propTypes = propTypes;
FeatureMenu.defaultProps = defaultProps;

export default FeatureMenu;
