import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import Zoom from 'react-spatial/components/Zoom';
import Geolocation from 'react-spatial/components/Geolocation';
import FitExtent from 'react-spatial/components/FitExtent';
import CONF from '../../config/appConfig';
import swissbounds from '../../img/swissbounds.png';
import './MapControls.scss';

const propTypes = {
  map: PropTypes.instanceOf(OLMap).isRequired,
  t: PropTypes.func.isRequired,
};

const MapControls = ({ map, t }) => (
  <div className="wkp-map-controls">
    <Zoom
      map={map}
      zoomSlider
      zoomInTitle={t('Hineinzoomen')}
      zoomOutTitle={t('Rauszoomen')}
      zoomInClassName="wkp-zoom-in"
      zoomOutClassName="wkp-zoom-out"
    />
    <Geolocation
      title={t('Lokalisieren')}
      className="wkp-geolocation"
      map={map}
      noCenterAfterDrag
      colorOrStyleFunc={[0, 61, 133]}
    />
    <FitExtent
      map={map}
      title={t('Ganze Schweiz')}
      extent={CONF.swissExtent}
      className="wkp-fit-extent"
    >
      {<img src={swissbounds} alt={t('Ganze Schweiz')} />}
    </FitExtent>
  </div>
);

MapControls.propTypes = propTypes;

export default compose(withTranslation())(MapControls);
