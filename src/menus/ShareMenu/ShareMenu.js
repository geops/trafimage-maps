import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FaShareAlt } from 'react-icons/fa';
import { AppContext } from '../../components/TrafimageMaps/TrafimageMaps';
import Share from '../../components/Share';
import MenuItem from '../../components/Menu/MenuItem';

const ShareMenu = () => {
  const { map } = useContext(AppContext);
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  return (
    <MenuItem
      open
      className="wkp-share-menu"
      title={t('Teilen')}
      icon={<FaShareAlt />}
      map={map}
      collapsed={collapsed}
      onCollapseToggle={c => setCollapsed(c)}
    >
      <Share map={map} />
    </MenuItem>
  );
};

export default React.memo(ShareMenu);
