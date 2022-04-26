import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Button from '../Button';
import { ReactComponent as MenuOpenImg } from '../../img/sbb/040_hamburgermenu_102_36.svg';
import { ReactComponent as MenuClosedImg } from '../../img/sbb/040_schliessen_104_36.svg';

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
      (l) =>
        !l.isBaseLayer && !l.get('hideInLegend') && !layerService.getParent(l),
    );
  const menuLayers = topicLayers.filter((l) => l.visible);
  return menuLayers.length > 0 && menuLayers.length === topicLayers.length
    ? t('alle aktiviert')
    : menuLayers.map((l) => t(l.name)).join(', ');
};

const TopicsMenuHeader = ({ isOpen, onToggle }) => {
  const layerService = useSelector((state) => state.app.layerService);
  const { name } = useSelector((state) => state.app.activeTopic || {});
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
      ariaExpanded={isOpen}
      tabIndex={0}
      title={t('Menü')}
      onClick={() => onToggle()}
    >
      <div className="wkp-menu-header-mobile">
        <div className="wkp-menu-header-toggler">
          {isOpen ? <MenuClosedImg /> : <MenuOpenImg />}
          <span className="wkp-menu-header-menu-title">{t('Menü')}</span>
        </div>
      </div>

      <div className="wkp-menu-header-desktop">
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
      </div>
    </Button>
  );
};

TopicsMenuHeader.propTypes = propTypes;
TopicsMenuHeader.defaultProps = defaultProps;

export default TopicsMenuHeader;
