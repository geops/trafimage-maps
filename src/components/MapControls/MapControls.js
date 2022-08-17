import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import Geolocate from '../../img/Geolocate';
import geolocateMarkerWithDirection from '../../img/geolocate_marker_direction.svg';
import geolocateMarker from '../../img/geolocate_marker.svg';
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

const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const MapControls = ({ geolocation, zoomSlider, fitExtent }) => {
  const { t } = useTranslation();
  const map = useSelector((state) => state.app.map);
  const [geolocationFeature, setGeolocationFeature] = useState(null);
  const [geolocating, setGeolocating] = useState(false);
  const featureRef = useRef(geolocationFeature);
  const setGeolocFeatureWithRef = (feature) => {
    featureRef.current = feature;
    setGeolocationFeature(feature);
  };

  const deviceOrientationListener = useCallback(
    (evt) => {
      const feature = featureRef.current; // Use ref to always get the current feature
      if (feature) {
        if (evt.webkitCompassHeading) {
          // For iOS
          feature.set('rotation', degreesToRadians(evt.webkitCompassHeading));
        } else if (evt.alpha || evt.alpha === 0) {
          // For normal OS
          feature.set('rotation', degreesToRadians(360 - evt.alpha));
        }
      }
    },
    [featureRef],
  );

  const onGeolocateToggle = useCallback(() => {
    if (geolocating) {
      // Deactivate geolocation
      setGeolocating(false);
      setGeolocFeatureWithRef();
      window.removeEventListener(
        'deviceorientation',
        deviceOrientationListener,
      );
      return;
    }
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
  }, [deviceOrientationListener, geolocating]);

  useEffect(() => {
    // Remove geolocate listener on component unmount
    return () =>
      window.removeEventListener(
        'deviceorientation',
        deviceOrientationListener,
      );
  }, [deviceOrientationListener]);

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
          className={`wkp-geolocation${
            geolocating ? ' wkp-geolocation-active' : ''
          }`}
          map={map}
          noCenterAfterDrag
          onSuccess={() => setGeolocating(true)}
          onError={() =>
            // eslint-disable-next-line no-alert
            alert(
              'Failed to get current location. Check your device and browser settings',
            )
          }
          colorOrStyleFunc={(feature) => {
            if (!feature || !geolocating) {
              return null;
            }
            if (!geolocationFeature || feature !== geolocationFeature) {
              setGeolocFeatureWithRef(feature);
            }
            const style = new Style();
            const rotation = feature.get('rotation');
            style.setImage(
              new Icon({
                src:
                  rotation || rotation === 0
                    ? geolocateMarkerWithDirection
                    : geolocateMarker,
                rotation: rotation || 0,
                anchor: [21, 46],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
              }),
            );
            return style;
          }}
        >
          <Geolocate focusable={false} onClick={onGeolocateToggle} />
        </Geolocation>
      )}
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
