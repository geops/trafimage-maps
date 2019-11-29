import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Button from '@geops/react-ui/components/Button';
import menuOpenImg from '../../img/menu_open.png';
import menuClosedImg from '../../img/menu_closed.png';

const propTypes = {
  onToggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};

const defaultProps = {
  isOpen: false,
};

// Update the subtitle depending on which layers are displayed.
const getSubtitle = (layerService, t) => {
  const topicLayers = layerService
    .getLayersAsFlatArray()
    .reverse()
    .filter(
      l =>
        !l.getIsBaseLayer() &&
        !l.get('hideInLegend') &&
        !layerService.getParent(l),
    );
  const menuLayers = topicLayers.filter(l => l.getVisible());
  return menuLayers.length > 0 && menuLayers.length === topicLayers.length
    ? t('alle aktiviert')
    : menuLayers.map(l => t(l.getName())).join(', ');
};

const TopicsMenuHeader = ({ isOpen, onToggle }) => {
  const layerService = useSelector(state => state.app.layerService);
  const { name } = useSelector(state => state.app.activeTopic || {});
  const { t } = useTranslation();
  const [subtitle, setSubtitle] = useState('');

  // Update subtitle on layer's visibility change.
  useEffect(() => {
    const cb = () => {
      setSubtitle(getSubtitle(layerService, t));
    };
    layerService.on('change:visible', cb);
    return () => {
      layerService.un('change:visible', cb);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update subtitle on language change and topic change.
  useEffect(() => {
    setSubtitle(getSubtitle(layerService, t));
  }, [layerService, t, name]);

  return (
    <Button
      className={`wkp-menu-header${isOpen ? ' open' : ''}`}
      tabIndex={0}
      title={t('Menü')}
      onClick={() => onToggle()}
    >
      <div className="wkp-menu-header-toggler">
        <div className="wkp-menu-header-toggler-icon">
          <img src={isOpen ? menuClosedImg : menuOpenImg} alt={t('Menü')} />
        </div>
        <span className="wkp-menu-toggle-text">{t('Menü')}</span>
      </div>
      <div className={`wkp-menu-title ${!subtitle ? '' : 'large'}`}>
        {t(name)}
      </div>
      <div className="wkp-menu-toggler">
        {isOpen ? (
          <FaAngleUp focusable={false} />
        ) : (
          <FaAngleDown focusable={false} />
        )}
      </div>
      <div className={`wkp-menu-layers ${subtitle ? '' : 'hidden'}`}>
        {subtitle}
      </div>
    </Button>
  );
};

TopicsMenuHeader.propTypes = propTypes;
TopicsMenuHeader.defaultProps = defaultProps;

export default TopicsMenuHeader;
