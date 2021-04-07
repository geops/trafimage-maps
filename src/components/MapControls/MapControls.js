import { memo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Zoom from 'react-spatial/components/Zoom';
import Geolocation from 'react-spatial/components/Geolocation';
import FitExtent from 'react-spatial/components/FitExtent';
// import { SwissBounds, ZoomOut, ZoomIn } from '../../img';
import { ReactComponent as SwissBounds } from '../../img/swissbounds.svg';
import { ReactComponent as ZoomOut } from '../../img/minus.svg';
import { ReactComponent as ZoomIn } from '../../img/plus.svg';
/*
import SwissBounds from '../../img/swissbounds.svg';
import ZoomOut from '../../img/minus.svg';
import ZoomIn from '../../img/plus.svg';
*/
import './MapControls.scss';

const swissExtent = [656409.5, 5740863.4, 1200512.3, 6077033.16];

const propTypes = {
  showGeolocation: PropTypes.bool,
};

const defaultProps = {
  showGeolocation: true,
};

const MapControls = ({ showGeolocation }) => {
  const map = useSelector((state) => state.app.map);
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
        zoomInChildren={<ZoomIn />}
        zoomOutChildren={<ZoomOut />}
        zoomSlider
        title={{
          zoomIn: t('Zoom'),
          zoomOut: t('Zoom'),
        }}
      />
      {geolocationButton}
      <FitExtent
        map={map}
        title={t('Ganze Schweiz')}
        extent={swissExtent}
        className="wkp-fit-extent"
      >
        <SwissBounds focusable={false} />
      </FitExtent>
    </div>
  );
};

MapControls.propTypes = propTypes;
MapControls.defaultProps = defaultProps;

export default memo(MapControls);
