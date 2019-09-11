import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import { FaShareAlt } from 'react-icons/fa';
import Share from '../Share';
import MenuHeader from './MenuHeader';
import Collapsible from '../Collapsible';
import './ShareMenu.scss';

const propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
};

const defaultProps = {};

const ShareMenu = ({ map }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="wkp-share-menu">
      <MenuHeader
        title={
          <>
            <FaShareAlt />
            <span>{t('Teilen')}</span>
          </>
        }
        className="wkp-share-header"
        headerLayerNames={t('Teilen')}
        isOpen={menuOpen}
        onToggle={() => setMenuOpen(!menuOpen)}
      />
      <Collapsible isCollapsed={!menuOpen}>
        <Share map={map} />
      </Collapsible>
    </div>
  );
};

ShareMenu.propTypes = propTypes;
ShareMenu.defaultProps = defaultProps;

export default React.memo(ShareMenu);
