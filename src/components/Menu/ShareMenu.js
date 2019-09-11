import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import Share from '../Share';
import MenuHeader from './MenuHeader';
import Collapsible from '../Collapsible';

const propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
};

const defaultProps = {};

const ShareMenu = ({ map }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <MenuHeader
        title={t('Teilen')}
        className="wkp-share-header"
        headerLayerNames={t('Teilen')}
        isOpen={menuOpen}
        onToggle={() => setMenuOpen(!menuOpen)}
      />
      <Collapsible isCollapsed={!menuOpen}>
        <Share map={map} />
      </Collapsible>
    </>
  );
};

ShareMenu.propTypes = propTypes;
ShareMenu.defaultProps = defaultProps;

export default React.memo(ShareMenu);
