import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import { FaShareAlt } from 'react-icons/fa';
import Share from '../Share';
import MenuItem from './MenuItem';

const propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
};

const defaultProps = {};

const ShareMenu = ({ map }) => {
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

ShareMenu.propTypes = propTypes;
ShareMenu.defaultProps = defaultProps;

export default React.memo(ShareMenu);
