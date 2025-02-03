/* eslint-disable no-underscore-dangle */
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
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
import useHasScreenSize from "../../utils/useHasScreenSize";
import { setZoomType } from "../../model/map/actions";

const propTypes = {
  geolocation: PropTypes.bool,
  zoomSlider: PropTypes.bool,
  fitExtent: PropTypes.bool,
  menuToggler: PropTypes.bool,
  children: PropTypes.node,
};

const useStyles = makeStyles((theme) => {
  return {
    mapControls: {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      top: 0,
      right: (props) => props.overlayWidth,
      marginTop: (props) => props.margin,
      marginRight: (props) => props.margin,
      gap: (props) => props.margin,
      "& .rs-zooms-bar": {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: (props) => {
          return props.margin;
        },
        "& .rs-zoomslider-wrapper": {
          margin: 0,
        },
        "& .ol-zoomslider": {
          border: "1px solid #5a5a5a !important",
          paddingBottom: "3px !important",
        },
        "& .ol-zoomslider-thumb": {
          background: `${theme.colors.darkGray} !important`,
        },
        "& .rs-zoom-in, .rs-zoom-out": {
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
  };
});

function MapControls({
  menuToggler = false,
  geolocation = true,
  zoomSlider = true,
  fitExtent = true,
  children,
}) {
  const dispatch = useDispatch();
  const overlayWidth = useOverlayWidth();
  const screenHeight = useSelector((state) => state.app.screenHeight);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const isSmallHeight = useMemo(() => {
    return ["xs", "s"].includes(screenHeight);
  }, [screenHeight]);
  const hasSmallHeader = useHasScreenSize(["xs", "s", "m"]);
  const isMobile = useHasScreenSize();
  const classes = useStyles({
    overlayWidth: isMobile ? 0 : overlayWidth,
    margin: hasSmallHeader || isSmallHeight ? 10 : 15,
  });
  const { t } = useTranslation();
  const map = useSelector((state) => state.app.map);
  const [zoomSliderRef, setZoomSliderRef] = useState(null);

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
          control.sliderInitialized_ = false;
          setZoomSliderRef(control.target_);
        } else {
          setZoomSliderRef(null);
        }
      });
    }
    return () => {
      if (map && key) {
        unByKey([key]);
      }
    };
  }, [dispatch, map, zoomSlider]);

  useEffect(() => {
    const onZoomSliderRefUpdate = () => {
      dispatch(setZoomType("slider"));
    };
    if (zoomSliderRef) {
      zoomSliderRef?.firstChild?.addEventListener(
        "mousedown",
        onZoomSliderRefUpdate,
      );
    }
    return () => {
      if (zoomSliderRef) {
        zoomSliderRef?.firstChild?.removeEventListener(
          "mousedown",
          onZoomSliderRefUpdate,
        );
      }
    };
  }, [dispatch, zoomSliderRef]);

  return (
    <div
      className={`wkp-map-controls ${classes.mapControls}`}
      data-testid="map-controls-wrapper"
    >
      {menuToggler && (activeTopic?.menuToggler ?? <MenuToggler />)}
      <Zoom
        map={map}
        zoomInChildren={<ZoomIn />}
        zoomOutChildren={<ZoomOut />}
        zoomSlider={!isSmallHeight && !isMobile && zoomSlider}
        titles={{
          zoomIn: t("Hineinzoomen"),
          zoomOut: t("Rauszoomen"),
        }}
        onZoomInButtonClick={() => {
          dispatch(setZoomType("maps control button"));
        }}
        onZoomOutButtonClick={() => {
          dispatch(setZoomType("maps control button"));
        }}
      />
      {geolocation && <Geolocation />}
      {fitExtent && <FitExtent />}
      {children}
    </div>
  );
}

MapControls.propTypes = propTypes;

export default React.memo(MapControls);
