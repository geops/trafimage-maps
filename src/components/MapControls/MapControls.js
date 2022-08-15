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
import { ReactComponent as Geolocate } from '../../img/geolocate.svg';
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

function degreesToRadians(degrees) {
  const pi = Math.PI;
  return degrees * (pi / 180);
}

const MapControls = ({ geolocation, zoomSlider, fitExtent }) => {
  const { t } = useTranslation();
  const map = useSelector((state) => state.app.map);
  const [testString, setTestString] = useState();
  const [geolocating, setGeolocating] = useState(false);
  const [geolocationFeature, setGeolocationFeature] = useState(null);
  const featureRef = useRef(geolocationFeature);
  const setGeolocFeatureWithRef = (feature) => {
    featureRef.current = feature;
    setGeolocationFeature(feature);
  };
  const [geolocationStyle] = useState(new Style());

  const deviceOrientationListener = useCallback(
    (evt) => {
      const feature = featureRef.current;
      if (feature) {
        if (evt.webkitCompassHeading) {
          // For iOS
          feature.set('rotation', degreesToRadians(evt.webkitCompassHeading));
        } else {
          feature.set('rotation', degreesToRadians(360 - evt.alpha));
        }
      }
    },
    [featureRef],
  );

  const onGeolocateToggle = useCallback(() => {
    if (geolocating) {
      setGeolocating(false);
      window.removeEventListener(
        'deviceorientation',
        deviceOrientationListener,
      );
      return;
    }
    setGeolocating(true);
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
          className="wkp-geolocation"
          map={map}
          noCenterAfterDrag
          colorOrStyleFunc={(feature) => {
            if (!feature) {
              return null;
            }
            if (!geolocationFeature || feature !== geolocationFeature) {
              setGeolocFeatureWithRef(feature);
            }
            const rotation = geolocationFeature?.get('rotation');
            geolocationStyle.setImage(
              new Icon({
                src:
                  rotation || rotation === 0
                    ? geolocateMarkerWithDirection
                    : geolocateMarker,
                anchor: [21, 46],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
              }),
            );
            geolocationStyle
              .getImage()
              .setRotation(feature.get('rotation') || 0);
            return geolocationStyle;
          }}
          onSuccess={(olMap, coordinate) => {
            setTestString(coordinate.toString());
          }}
        >
          <Geolocate focusable={false} onClick={onGeolocateToggle} />
        </Geolocation>
      )}
      <span style={{ position: 'absolute', left: '-50vw', width: 100 }}>
        <div>coord: {testString}</div>
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
