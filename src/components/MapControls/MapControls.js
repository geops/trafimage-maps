import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Zoom from 'react-spatial/components/Zoom';
import Geolocation from 'react-spatial/components/Geolocation';
import FitExtent from 'react-spatial/components/FitExtent';
import swissbounds from '../../img/swissbounds.png';
import './MapControls.scss';

const swissExtent = [656409.5, 5740863.4, 1200512.3, 6077033.16];

const propTypes = {
  showGeolocation: PropTypes.bool,
};

const defaultProps = {
  showGeolocation: true,
};

const MapControls = ({ showGeolocation }) => {
  const map = useSelector(state => state.app.map);
  const { t } = useTranslation();
  let geolocationButton = null;

  if (showGeolocation) {
    geolocationButton = (
      <Geolocation
        title={t('Lokalisieren')}
        className="wkp-geolocation"
        map={map}
        noCenterAfterDrag
        colorOrStyleFunc={[0, 61, 133]}
      />
    );
  }

  return (
    <div className="wkp-map-controls">
      <Zoom
        map={map}
        zoomSlider
        zoomInTitle={t('Zoom')}
        zoomOutTitle={t('Zoom')}
        zoomInClassName="wkp-zoom-in"
        zoomOutClassName="wkp-zoom-out"
      />
      {geolocationButton}
      <FitExtent
        map={map}
        title={t('Ganze Schweiz')}
        extent={swissExtent}
        className="wkp-fit-extent"
      >
        <img src={swissbounds} alt={t('Ganze Schweiz')} />
      </FitExtent>
    </div>
  );
};

MapControls.propTypes = propTypes;
MapControls.defaultProps = defaultProps;

export default React.memo(MapControls);
