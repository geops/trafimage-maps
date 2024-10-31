import React, { useRef, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Drawer } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Resizable } from "re-resizable";
import FeatureInformation from "../FeatureInformation";
import { setFeatureInfo, setOverlayElement } from "../../model/app/actions";
import usePrevious from "../../utils/usePrevious";
import { OVERLAY_MIN_HEIGHT } from "../../utils/constants";
import useHasScreenSize from "../../utils/useHasScreenSize";

const useStyles = makeStyles((theme) => ({
  drawerRoot: {
    position: "absolute !important",
  },
  drawer: {
    "& .wkp-feature-information": {
      height: "100%",
      overflow: "hidden",
    },
    "& .wkp-feature-information-body": {
      height: "calc(100% - 50px)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      "& > div:first-child": {
        // Normally this div is the root element of a popup component
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      },
    },
  },
  drawerDesktop: {
    pointerEvents: "none",
    "& .wkp-feature-information": {
      pointerEvents: "all",
      maxWidth: 400,
      minWidth: 250,
    },
  },
  drawerDesktopPaper: {
    boxShadow: "-5px 0px 10px -6px rgb(0 0 0 / 40%)",
    height: "initial",
    borderColor: "#cdcdcd",
    borderStyle: "solid",
    borderWidth: "1px 0 1px 0",
    overflow: "hidden",
    position: "absolute",
    pointerEvents: "all",
    top: 0,
    bottom: 0,
  },
  headerActive: {
    top: 100,
  },
  mobileHeader: {
    top: 55,
  },
  footerActive: {
    bottom: 40,
  },
  drawerMobile: {
    pointerEvents: "none",
    "& .wkp-feature-information": {
      width: "100%",
    },
  },
  drawerMobileSmooth: {
    "& > .MuiPaper-root > div:first-child": {
      transition: "height .3s ease",
    },
  },
  drawerMobilePaper: {
    position: "absolute",
    pointerEvents: "all",
  },
  resizeHandle: {
    position: "fixed",
    display: "flex",
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1001,
    "&::before": {
      content: '""',
      height: 4,
      width: 50,
      top: 12,
      left: "50%",
      transform: "translate(calc(-50% + 30px), -50%)",
      position: "absolute",
      borderRadius: 5,
      backgroundColor: theme.colors.lighterGray,
    },
  },
  resizeResetButton: {
    width: "calc(100% - 50px)",
    height: 55,
    zIndex: 1000,
    border: "none",
    background: "transparent",
  },
}));

const propTypes = {
  elements: PropTypes.shape().isRequired,
  children: PropTypes.node,
  disablePortal: PropTypes.bool,
  transitionDuration: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      appear: PropTypes.number,
      enter: PropTypes.number,
      exit: PropTypes.number,
    }),
  ]),
  ResizableProps: PropTypes.shape({
    defaultSize: PropTypes.shape({
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    snap: PropTypes.shape({
      x: PropTypes.arrayOf(PropTypes.number),
      y: PropTypes.arrayOf(PropTypes.number),
    }),
    onResize: PropTypes.func,
  }),
};

const defaultResizableProps = {
  defaultSize: { height: 200 },
  onResize: () => {},
  snap: null,
};

function Overlay({
  elements,
  children = null,
  disablePortal = true,
  transitionDuration = undefined,
  ResizableProps = defaultResizableProps,
}) {
  const classes = useStyles();
  const resizeRef = useRef(null);
  const [isSnapSmooth, setSnapSmooth] = useState(false);
  const [node, setNode] = useState(null);
  const { defaultSize } = ResizableProps;
  const isMobile = useHasScreenSize();
  const isSmallerThanMd = useHasScreenSize(["xs", "s", "m"]);

  const resetOverlayHeight = useCallback(() => {
    if (resizeRef?.current) {
      resizeRef.current.resizable.style.height = `${defaultSize.height}px`;
    }
  }, [defaultSize.height]);

  const dispatch = useDispatch();
  const activeTopic = useSelector((state) => state.app.activeTopic);
  let featureInfo = useSelector((state) => state.app.featureInfo);
  const previousFeatureInfo = usePrevious(featureInfo);

  useEffect(() => {
    // Reset the overlay height if another feature is selected on the map
    if (featureInfo?.length && featureInfo !== previousFeatureInfo) {
      resetOverlayHeight();
    }
  }, [featureInfo, previousFeatureInfo, resetOverlayHeight]);

  useEffect(() => {
    dispatch(setOverlayElement(isMobile ? null : node));
    return () => dispatch(setOverlayElement(null));
  }, [isMobile, node, dispatch]);

  if (!featureInfo || !featureInfo.length) {
    return null;
  }

  if (activeTopic.modifyFeatureInfo) {
    featureInfo = activeTopic.modifyFeatureInfo(featureInfo);
  }

  const filtered = featureInfo.filter((info) => {
    const { layer, features } = info;

    if (layer.get("popupComponent") && layer.get("useOverlay")) {
      if (typeof layer.hidePopup === "function") {
        return features.find((f) => !layer.hidePopup(f, layer, featureInfo));
      }
      return true;
    }
    return false;
  });

  if (!children && !filtered.length) {
    return null;
  }
  return (
    <div>
      <Drawer
        transitionDuration={transitionDuration}
        className={`${classes.drawer} ${
          isMobile ? classes.drawerMobile : classes.drawerDesktop
        } ${isSnapSmooth ? classes.drawerMobileSmooth : ""}`}
        classes={{
          root: classes.drawerRoot,
          paper: isMobile
            ? `${classes.drawerMobilePaper}`
            : `${[
                classes.drawerDesktopPaper,
                elements.header && !isSmallerThanMd ? classes.headerActive : "",
                elements.header && isSmallerThanMd ? classes.mobileHeader : "",
                elements.footer ? classes.footerActive : "",
              ].join(" ")}`,
        }}
        anchor={isMobile ? "bottom" : "right"}
        open
        onClose={() => {
          dispatch(setFeatureInfo());
        }}
        ModalProps={{
          disableEnforceFocus: true,
          disablePortal,
          container: !disablePortal
            ? document.getElementsByClassName("tm-barrier-free")[0]
            : null,
          BackdropComponent: () => {
            return null;
          },
        }}
        PaperProps={{
          ref: (el) => setNode(el),
        }}
      >
        {isMobile && (
          <Resizable
            ref={resizeRef}
            enable={{ top: isMobile }}
            maxHeight="100vh"
            minHeight={OVERLAY_MIN_HEIGHT}
            onResizeStart={() => {
              if (ResizableProps?.snap?.y) {
                setSnapSmooth(false);
              }
            }}
            onResizeStop={() => {
              // We do the snap manually to have a befalsetance = Infinity;
              const snaps = ResizableProps?.snap?.y;
              if (snaps) {
                let closerSnapDistance = Infinity;
                let closerSnap = snaps[0];
                snaps.forEach((snap) => {
                  if (
                    Math.abs(resizeRef.current.state.height - snap) <
                    closerSnapDistance
                  ) {
                    closerSnapDistance = resizeRef.current.state.height - snap;
                    closerSnap = snap;
                  }
                });
                setSnapSmooth(true);
                resizeRef.current.updateSize({ height: closerSnap });
              }
            }}
            handleComponent={{
              top: (
                <>
                  {/* When then Overlay is swiped completely to the bottom,
                  clicking the header will reset it to default height */}
                  <button
                    className={`${classes.resizeResetButton} ${classes.resizeHandle}`}
                    type="button"
                    onClick={resetOverlayHeight}
                  >
                    {" "}
                  </button>
                </>
              ),
            }}
            {...ResizableProps}
            snap={null} // We do the snap manually
          >
            {children || <FeatureInformation featureInfo={filtered} />}
          </Resizable>
        )}
        {!isMobile &&
          (children || <FeatureInformation featureInfo={filtered} />)}
      </Drawer>
    </div>
  );
}

Overlay.propTypes = propTypes;

export default Overlay;
