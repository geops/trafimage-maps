import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ShareSVG } from '../../img/sbb/share/share_25_large.svg';
import Share from '../../components/Share';
import MenuItem from '../../components/Menu/MenuItem';

const propTypes = {
  appBaseUrl: PropTypes.string,
};

const defaultProps = {
  appBaseUrl: null,
};

const ShareMenu = ({ appBaseUrl }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  return (
    <MenuItem
      open
      fixedHeight={375}
      className="wkp-share-menu"
      title={t('Teilen')}
      icon={<ShareSVG focusable={false} />}
      collapsed={collapsed}
      onCollapseToggle={c => setCollapsed(c)}
    >
      <Share appBaseUrl={appBaseUrl} />
    </MenuItem>
  );
};

ShareMenu.propTypes = propTypes;
ShareMenu.defaultProps = defaultProps;

export default React.memo(ShareMenu);
