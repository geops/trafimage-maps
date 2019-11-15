import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaShareAlt } from 'react-icons/fa';
import Share from '../../components/Share';
import MenuItem from '../../components/Menu/MenuItem';

const ShareMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  return (
    <MenuItem
      open
      className="wkp-share-menu"
      title={t('Teilen')}
      icon={<FaShareAlt />}
      collapsed={collapsed}
      onCollapseToggle={c => setCollapsed(c)}
    >
      <Share />
    </MenuItem>
  );
};

export default React.memo(ShareMenu);
