/* eslint-disable no-underscore-dangle */
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Zoom from "react-spatial/components/Zoom";
import { makeStyles } from "@mui/styles";
import FitExtent from "./FitExtent";
import Geolocation from "./Geolocation";
import MenuToggler from "./MenuToggler";
import useOverlayWidth from "../../utils/useOverlayWidth";
import { ReactComponent as ZoomOut } from "../../img/minus.svg";
import { ReactComponent as ZoomIn } from "../../img/plus.svg";
import useHasScreenSize from "../../utils/useHasScreenSize";
import { setZoomType } from "../../model/map/actions";
import FloorSwitcher from "../FloorSwitcher";

const propTypes = {
  geolocation: PropTypes.bool,
  fitExtent: PropTypes.bool,
  menuToggler: PropTypes.bool,
  floorSwitcher: PropTypes.bool,
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
        boxShadow: "0 0 7px rgb(0 0 0 / 90%)",
        transition: "box-shadow 0.5s ease",
        backgroundColor: "#e8e7e7",
        borderRadius: 20,
        gap: 1,
        overflow: "clip",
        "&:hover": { boxShadow: "0 0 12px 2px rgb(0 0 0 / 90%)" },
        "& .rs-zoom-in, .rs-zoom-out": {
          background: "white",
          height: 40,
          width: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
          color: theme.colors.darkGray,
          "& svg": {
            "& path": {
              transition: "stroke 0.5s ease",
              fill: "currentColor",
              stroke: "currentColor",
            },
          },
          "&:disabled": {
            boxShadow: "0 0 7px 2px rgb(0 0 0 / 40%)",
            cursor: "default",
          },
          "&:hover": {
            color: theme.palette.secondary.dark,
          },
        },
      },
    },
  };
});

function MapControls({
  menuToggler = false,
  geolocation = true,
  fitExtent = true,
  floorSwitcher = false,
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
        zoomSlider={false}
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
      {floorSwitcher && <FloorSwitcher />}
      {children}
    </div>
  );
}

MapControls.propTypes = propTypes;

export default React.memo(MapControls);
