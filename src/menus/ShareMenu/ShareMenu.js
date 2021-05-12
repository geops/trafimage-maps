import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FaShareAlt } from 'react-icons/fa';
import Share from '../../components/Share';
import MenuItem from '../../components/Menu/MenuItem';

const propTypes = {
  appBaseUrl: PropTypes.string,
  collapsedOnLoad: PropTypes.bool,
};

const defaultProps = {
  appBaseUrl: null,
  collapsedOnLoad: false,
};

const ShareMenu = ({ appBaseUrl, collapsedOnLoad }) => {
  const [collapsed, setCollapsed] = useState(collapsedOnLoad);
  const { t } = useTranslation();

  useEffect(() => {
    // When switching topics
    setCollapsed(collapsedOnLoad);
  }, [collapsedOnLoad]);

  return (
    <MenuItem
      open
      fixedHeight={375}
      className="wkp-share-menu"
      title={t('Teilen')}
      icon={<FaShareAlt focusable={false} />}
      collapsed={collapsed}
      onCollapseToggle={(c) => setCollapsed(c)}
    >
      <Share appBaseUrl={appBaseUrl} />
    </MenuItem>
  );
};

ShareMenu.propTypes = propTypes;
ShareMenu.defaultProps = defaultProps;

export default React.memo(ShareMenu);
