import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPencilAlt } from 'react-icons/fa';
import MenuItem from '../../components/Menu/MenuItem';
import Draw from '../../components/Draw';

function DrawMenu() {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  return (
    <MenuItem
      open
      title={t('Zeichnen auf der Karte')}
      icon={<FaPencilAlt focusable={false} />}
      collapsed={collapsed}
      onCollapseToggle={(c) => setCollapsed(c)}
    >
      <Draw />
    </MenuItem>
  );
}

export default React.memo(DrawMenu);
