import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FaInfo } from 'react-icons/fa';
import FeatureInformation from '../FeatureInformation';
import MenuItem from '../Menu/MenuItem';

const propTypes = {
  popupComponents: PropTypes.objectOf(PropTypes.string).isRequired,
};

const FeatureMenu = ({ popupComponents }) => {
  const { t } = useTranslation();
  const clickedFeatureInfo = useSelector(state => state.app.clickedFeatureInfo);
  const [collapsed, setCollapsed] = useState(false);

  if (!clickedFeatureInfo || !clickedFeatureInfo.length) {
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
      <FeatureInformation
        clickedFeatureInfo={clickedFeatureInfo}
        popupComponents={popupComponents}
      />
    </MenuItem>
  );
};

FeatureMenu.propTypes = propTypes;

export default FeatureMenu;
