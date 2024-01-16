import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import Zoom from "react-spatial/components/Zoom";
import Geolocation from "react-spatial/components/Geolocation";
import FitExtent from "react-spatial/components/FitExtent";
import { ZoomSlider } from "ol/control";
import { unByKey } from "ol/Observable";
import { Style, Icon } from "ol/style";
import { makeStyles } from "@mui/styles";
import MapButton from "../MapButton/MapButton";
import { SWISS_EXTENT } from "../../utils/constants";
import useOverlayWidth from "../../utils/useOverlayWidth";
import { setDisplayMenu } from "../../model/app/actions";
import { ReactComponent as SwissBounds } from "../../img/swissbounds.svg";
import { ReactComponent as ZoomOut } from "../../img/minus.svg";
import { ReactComponent as ZoomIn } from "../../img/plus.svg";
import { ReactComponent as MenuOpen } from "../../img/sbb/040_hamburgermenu_102_36.svg";
import { ReactComponent as MenuClosed } from "../../img/sbb/040_schliessen_104_36.svg";
import Geolocate from "../../img/Geolocate";
import geolocateMarkerWithDirection from "../../img/geolocate_marker_direction.svg";
import geolocateMarker from "../../img/geolocate_marker.svg";
import useIsMobile from "../../utils/useIsMobile";

const propTypes = {
  geolocation: PropTypes.bool,
  zoomSlider: PropTypes.bool,
  fitExtent: PropTypes.bool,
  menuToggler: PropTypes.bool,
  children: PropTypes.node,
};

const defaultProps = {
  geolocation: true,
  zoomSlider: true,
  fitExtent: true,
  menuToggler: false,
  children: undefined,
};

const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const useStyles = makeStyles((theme) => {
  return {
    mapControls: {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      right: (props) => (props.isMobile ? 15 : props.overlayWidth + 15),
      "& .rs-zooms-bar": {
        "& .ol-zoomslider": {
          border: "1px solid #5a5a5a !important",
          paddingBottom: "3px !important",
        },
        "& .ol-zoomslider-thumb": {
          background: `${theme.colors.darkGray} !important`,
        },
        "& .rs-zoom-in, .rs-zoom-out": {
          margin: "10px 0",
          background: "white",
          boxShadow: "0 0 7px rgb(0 0 0 / 90%)",
          borderRadius: "50%",
          height: "40px",
          width: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "box-shadow 0.5s ease",
          border: "none",
          "& svg": {
            "& path": {
              transition: "stroke 0.5s ease",
              fill: theme.colors.darkGray,
            },
          },
          "&:hover": { boxShadow: "0 0 12px 2px rgb(0 0 0 / 90%)" },
          "&:disabled": {
            boxShadow: "0 0 7px 2px rgb(0 0 0 / 40%)",
            cursor: "default",
          },
        },
      },
    },
    "@keyframes fadeInOut": {
      "0%": { opacity: 0 },
      "50%": { opacity: 1 },
      "100%": { opacity: 0 },
    },
    geolocation: {
      padding: 0,
      color: theme.colors.darkGray,
      "&:hover": {
        color: theme.colors.darkGray,
      },
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
    },
    fitExtent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 5,
      margin: "10px 0",
      color: theme.colors.darkGray,
      "&:hover": {
        color: theme.colors.darkGray,
      },
    },
    rsFitExtent: {
      height: "100%",
      width: "100%",
    },
    displayMenuToggler: { padding: "8px", margin: "10px 0" },
  };
});

function MapControls({
  menuToggler,
  geolocation,
  zoomSlider,
  fitExtent,
  children,
}) {
  const overlayWidth = useOverlayWidth();
  const isMobile = useIsMobile();
  const classes = useStyles({ overlayWidth, isMobile });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const map = useSelector((state) => state.app.map);
  const displayMenu = useSelector((state) => state.app.displayMenu);
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

  useEffect(() => {
    let key = null;
    // on resize reload the zoomSlider control
    if (zoomSlider) {
      key = map.on("change:size", () => {
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
    <div
      className={`wkp-map-controls ${classes.mapControls}`}
      data-testid="map-controls-wrapper"
    >
      {menuToggler && (
        <MapButton
          className={`wkp-display-menu-toggler ${classes.displayMenuToggler}`}
          onClick={() => dispatch(setDisplayMenu(!displayMenu))}
          title={t("Menü")}
          data-testid="map-controls-menu-toggler"
        >
          {displayMenu ? <MenuClosed /> : <MenuOpen />}
        </MapButton>
      )}
      <Zoom
        map={map}
        zoomInChildren={<ZoomIn />}
        zoomOutChildren={<ZoomOut />}
        zoomSlider={zoomSlider}
        titles={{
          zoomIn: t("Hineinzoomen"),
          zoomOut: t("Rauszoomen"),
        }}
      />
      {geolocation && (
        <MapButton
          onClick={onGeolocateToggle}
          className={`wkp-geolocation ${classes.geolocation} ${geolocating ? classes.geolocationActive : ""}`}
          data-testid="map-controls-geolocation"
        >
          <Geolocation
            title={t("Lokalisieren")}
            className={classes.rsGeolocation}
            map={map}
            noCenterAfterDrag
            onSuccess={() => setGeolocating(true)}
            onError={() => setGeolocating(false)}
            colorOrStyleFunc={styleFunction}
          >
            <Geolocate focusable={false} />
          </Geolocation>
        </MapButton>
      )}
      {fitExtent && (
        <MapButton
          className={`wkp-fit-extent ${classes.fitExtent}`}
          data-testid="map-controls-fit-extent"
        >
          <FitExtent
            map={map}
            title={t("Ganze Schweiz")}
            extent={SWISS_EXTENT}
            className={classes.rsFitExtent}
          >
            <SwissBounds focusable={false} />
          </FitExtent>
        </MapButton>
      )}
      {children}
    </div>
  );
}

MapControls.propTypes = propTypes;
MapControls.defaultProps = defaultProps;

export default React.memo(MapControls);
