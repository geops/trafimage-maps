import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Zoom from "react-spatial/components/Zoom";
import { ZoomSlider } from "ol/control";
import { unByKey } from "ol/Observable";
import { makeStyles } from "@mui/styles";
import FitExtent from "./FitExtent";
import Geolocation from "./Geolocation";
import MenuToggler from "./MenuToggler";
import useOverlayWidth from "../../utils/useOverlayWidth";
import { ReactComponent as ZoomOut } from "../../img/minus.svg";
import { ReactComponent as ZoomIn } from "../../img/plus.svg";
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

const useStyles = makeStyles((theme) => {
  return {
    mapControls: {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      gap: (props) => (props.isMobile ? 5 : 8),
      right: (props) => (props.isMobile ? 10 : props.overlayWidth + 15),
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
  const map = useSelector((state) => state.app.map);

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
      {menuToggler && <MenuToggler />}
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
      {geolocation && <Geolocation />}
      {fitExtent && <FitExtent />}
      {children}
    </div>
  );
}

MapControls.propTypes = propTypes;
MapControls.defaultProps = defaultProps;

export default React.memo(MapControls);
