import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Zoom from 'react-spatial/components/Zoom';
import Geolocation from 'react-spatial/components/Geolocation';
import FitExtent from 'react-spatial/components/FitExtent';
import { ZoomSlider } from 'ol/control';
import { unByKey } from 'ol/Observable';
import { Style, Icon } from 'ol/style';
import { ReactComponent as SwissBounds } from '../../img/swissbounds.svg';
import { ReactComponent as ZoomOut } from '../../img/minus.svg';
import { ReactComponent as ZoomIn } from '../../img/plus.svg';
import geolocate from '../../img/geolocate_animated.svg';
import './MapControls.scss';

const swissExtent = [656409.5, 5740863.4, 1200512.3, 6077033.16];

const propTypes = {
  geolocation: PropTypes.bool,
  zoomSlider: PropTypes.bool,
  fitExtent: PropTypes.bool,
};

const defaultProps = {
  geolocation: true,
  zoomSlider: true,
  fitExtent: true,
};

const MapControls = ({ geolocation, zoomSlider, fitExtent }) => {
  const map = useSelector((state) => state.app.map);
  const [deviceDirection, setDeviceDirection] = useState('nuthing');
  const { t } = useTranslation();
  const deviceOrientationListener = (event) => {
    if (event.webkitCompassHeading) {
      // Apple works only with this, alpha doesn't work
      setDeviceDirection(event.webkitCompassHeading);
    } else {
      setDeviceDirection(event.alpha);
    }
  };

  useEffect(() => {
    // Remove geolocate listener on component unmount
    return () =>
      window.removeEventListener(
        'deviceorientation',
        deviceOrientationListener,
      );
  }, []);

  useEffect(() => {
    let key = null;
    // on resize reload the zoomSlider control
    if (zoomSlider) {
      key = map.on('change:size', () => {
        const control = map
          .getControls()
          .getArray()
          .find((ctrl) => ctrl instanceof ZoomSlider);
        if (control) {
          // Force reinitialization of the control
          // eslint-disable-next-line no-underscore-dangle
          control.sliderInitialized_ = false;
        }
      });
    }
    return () => {
      if (map && key) {
        unByKey(key);
      }
    };
  }, [map, zoomSlider]);

  const onGeolocateSuccess = useCallback(() => {
    if (window.DeviceOrientationEvent) {
      // Listen for the deviceorientation event and handle the raw data
      window.addEventListener('deviceorientation', deviceOrientationListener);
    }
  }, []);

  return (
    <div className="wkp-map-controls">
      <Zoom
        map={map}
        zoomInChildren={<ZoomIn />}
        zoomOutChildren={<ZoomOut />}
        zoomSlider={zoomSlider}
        title={{
          zoomIn: t('Zoom'),
          zoomOut: t('Zoom'),
        }}
      />
      {geolocation && (
        <Geolocation
          title={t('Lokalisieren')}
          className="wkp-geolocation"
          map={map}
          noCenterAfterDrag
          onSuccess={onGeolocateSuccess}
          onDeactivate={() =>
            window.removeEventListener(
              'deviceorientation',
              deviceOrientationListener,
            )
          }
          colorOrStyleFunc={() => {
            return new Style({
              image: new Icon({
                src: geolocate,
                anchor: [49, 63],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                rotation: 0,
                rotateWithView: true,
              }),
            });
          }}
        />
      )}
      {deviceDirection && <span>{deviceDirection}</span>}
      {fitExtent && (
        <FitExtent
          map={map}
          title={t('Ganze Schweiz')}
          extent={swissExtent}
          className="wkp-fit-extent"
        >
          <SwissBounds focusable={false} />
        </FitExtent>
      )}
    </div>
  );
};

MapControls.propTypes = propTypes;
MapControls.defaultProps = defaultProps;

export default React.memo(MapControls);
