import React, { useRef, useCallback, useState, useEffect } from "react";
import { Style, Icon } from "ol/style";
import { makeStyles } from "@mui/styles";
import RsGeolocation from "react-spatial/components/Geolocation";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import MapButton from "../../MapButton";
import Geolocate from "../../../img/Geolocate";
import geolocateMarkerWithDirection from "../../../img/geolocate_marker_direction.svg";
import geolocateMarker from "../../../img/geolocate_marker.svg";

const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const useStyles = makeStyles((theme) => ({
  ...theme.animations,
  geolocation: {
    padding: 0,
  },
  geolocationActive: {
    color: "#006aff",
    "&:hover": {
      color: "#006aff",
    },
    "& svg": {
      animation: "$fadeInOut 1.5s infinite",
    },
  },
  rsGeolocation: {
    display: "flex",
    alignItems: "center",
    borderRadius: "50%",
  },
}));

function Geolocation() {
  const classes = useStyles();
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
          feature.set("rotation", degreesToRadians(evt.webkitCompassHeading));
        } else if (evt.alpha || evt.alpha === 0) {
          if (evt.absolute) {
            feature.set("rotation", degreesToRadians(360 - evt.alpha));
          } else {
            // not absolute event; e.g. firefox, lets disable everything again
            window.removeEventListener(
              "deviceorientation",
              deviceOrientationListener,
            );
            feature.set("rotation", false);
          }
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
        "deviceorientation",
        deviceOrientationListener,
      );
      return;
    }
    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener(
        "deviceorientationabsolute",
        deviceOrientationListener,
      );
    } else if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            window.addEventListener(
              "deviceorientation",
              deviceOrientationListener,
              true,
            );
          }
        })
        .catch(alert);
    } else {
      window.addEventListener("deviceorientation", deviceOrientationListener);
    }
  }, [deviceOrientationListener, geolocating]);

  const styleFunction = useCallback(
    (feature) => {
      if (!feature) {
        return null;
      }
      if (!geolocationFeature || feature !== geolocationFeature) {
        setGeolocFeatureWithRef(feature);
      }
      const style = new Style();
      const rotation = feature.get("rotation");
      style.setImage(
        new Icon({
          src:
            rotation || rotation === 0
              ? geolocateMarkerWithDirection
              : geolocateMarker,
          rotation: rotation || 0,
          anchor: [21, 46],
          anchorXUnits: "pixels",
          anchorYUnits: "pixels",
        }),
      );
      return style;
    },
    [geolocationFeature],
  );

  useEffect(() => {
    // Remove geolocate listener on component unmount
    return () =>
      window.removeEventListener(
        "deviceorientation",
        deviceOrientationListener,
      );
  }, [deviceOrientationListener]);

  return (
    <MapButton
      onClick={onGeolocateToggle}
      className={`wkp-geolocation ${classes.geolocation} ${geolocating ? classes.geolocationActive : ""}`}
      data-testid="map-controls-geolocation"
      tabIndex={-1}
    >
      <RsGeolocation
        title={t("Lokalisieren")}
        className={classes.rsGeolocation}
        map={map}
        noCenterAfterDrag
        onSuccess={() => setGeolocating(true)}
        onError={() => setGeolocating(false)}
        colorOrStyleFunc={styleFunction}
      >
        <Geolocate focusable={false} />
      </RsGeolocation>
    </MapButton>
  );
}

Geolocation.propTypes = {};

export default Geolocation;
