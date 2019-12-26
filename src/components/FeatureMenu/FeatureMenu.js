import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaInfo } from 'react-icons/fa';
import FeatureInformation from '../FeatureInformation';
import MenuItem from '../Menu/MenuItem';

const FeatureMenu = () => {
  const { t } = useTranslation();
  const featureInfo = useSelector(state => state.app.featureInfo);
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
      onCollapseToggle={c => setCollapsed(c)}
    >
      <FeatureInformation featureInfo={featureInfo} />
    </MenuItem>
  );
};

export default FeatureMenu;
