import React, { useEffect, useState } from 'react';
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

function degreesToRadians(degrees) {
  const pi = Math.PI;
  return degrees * (pi / 180);
}

const MapControls = ({ geolocation, zoomSlider, fitExtent }) => {
  const map = useSelector((state) => state.app.map);
  const [deviceDirection, setDeviceDirection] = useState(degreesToRadians(0));
  const { t } = useTranslation();
  const deviceOrientationListener = (evt) => {
    if (evt.webkitCompassHeading) {
      // Apple works only with this, alpha doesn't work
      setDeviceDirection(degreesToRadians(evt.webkitCompassHeading));
    } else {
      setDeviceDirection(degreesToRadians(evt.alpha));
    }
  };

  const onGeolocateActivate = () => {
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener(
        'deviceorientationabsolute',
        deviceOrientationListener,
      );
    } else if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            window.addEventListener(
              'deviceorientation',
              deviceOrientationListener,
              true,
            );
          }
        })
        .catch(alert);
    } else {
      window.addEventListener('deviceorientation', deviceOrientationListener);
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
          onDeactivate={() => {
            setDeviceDirection('wank');
            window.removeEventListener(
              'deviceorientation',
              deviceOrientationListener,
            );
          }}
          colorOrStyleFunc={() => {
            return new Style({
              image: new Icon({
                src: geolocate,
                anchor: [49, 63],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                rotation: deviceDirection,
                rotateWithView: true,
              }),
            });
          }}
        >
          <ZoomIn focusable={false} onClick={onGeolocateActivate} />
        </Geolocation>
      )}
      <span style={{ position: 'absolute', left: '-50vw', width: 100 }}>
        <div>Direction: {deviceDirection}</div>
      </span>
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
