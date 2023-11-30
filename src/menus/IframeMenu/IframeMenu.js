/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MdClose } from "react-icons/md";
import Overlay from "../../components/Overlay/Overlay";
import { setDisplayMenu, setFeatureInfo } from "../../model/app/actions";
import { OVERLAY_MIN_HEIGHT } from "../../utils/constants";
import useIsMobile from "../../utils/useIsMobile";

const IFRAME_OVERLAY_DEFAULT_HEIGHT = 300;

const boxShadow =
  "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)";

const stylesContainer = {
  boxSizing: "border-box",
  backgroundColor: "white",
  boxShadow: (props) => (props.displayMenu ? boxShadow : null),
  borderRadius: 8,
  overflow: "hidden",
};
const useStyles = makeStyles((theme) => {
  return {
    menuHeader: stylesContainer,
    menuContent: {
      height: (props) =>
        props.featureSelected && !props.isMobile
          ? "calc(100vh - 30px)"
          : "unset",
    },
    menuContentMobile: {
      padding: "50px 0 0",
    },
    featureInfo: {
      ...stylesContainer,
      marginTop: (props) => (props.header ? 15 : 0),
      height: (props) =>
        `calc(100vh - ${props.header ? props.headerHeight + 40 : 25}px)`,
      "& > div": {
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          width: 6,
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(0, 0, 0, 0.1)",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(0, 0, 0, 0.4)",
        },
      },
    },
    mobileHandleWrapper: {
      position: "absolute",
      width: "100%",
      height: OVERLAY_MIN_HEIGHT,
      top: 0,
      right: 0,
      zIndex: 1000,
    },
    mobileHandle: {
      position: "fixed",
      backgroundColor: "#f5f5f5",
      borderBottom: `1px solid #F0F0F0`,
      width: "inherit",
      height: "inherit",
      display: "flex",
      alignItems: "center",
    },
    mobileTitle: {
      padding: "0 15px",
      maxWidth: "calc(100vw - 65px)",
    },
    closeBtn: {
      position: "fixed",
      right: 0,
      padding: "13px 10px",
      marginRight: 2,
      zIndex: 1002,
      height: OVERLAY_MIN_HEIGHT,
    },
    hide: { display: "none" },
    bottomFade: {
      "&::after": {
        ...theme.styles.bottomFade["&::after"],
        borderRadius: 8,
      },
    },
  };
});

function IframeMenu({ header, body, hide, title, ResizableProps }) {
  const dispatch = useDispatch();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const displayMenu = useSelector((state) => state.app.displayMenu);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const isMobile = useIsMobile();
  const [headerHeight, setHeaderHeight] = useState(0);
  const classes = useStyles({
    displayMenu,
    featureSelected: featureInfo?.length,
    isMobile,
    headerHeight,
    header,
    title,
  });

  useEffect(() => {
    if (featureInfo?.length) {
      dispatch(setDisplayMenu(!isMobile));
    }
  }, [featureInfo, isMobile, dispatch]);

  return (
    <div className={hide ? classes.hide : ""}>
      {displayMenu && (
        <div className={classes.menuContent}>
          <div
            className={classes.menuHeader}
            ref={(el) => setHeaderHeight(el?.clientHeight)}
          >
            {header}
          </div>
          {!isMobile && featureInfo?.length ? (
            <div className={`${classes.featureInfo} ${classes.bottomFade}`}>
              {title}
              {body}
            </div>
          ) : null}
        </div>
      )}
      {isMobile && featureInfo?.length ? (
        <Overlay
          elements={activeTopic.elements}
          disablePortal={false}
          transitionDuration={0}
          ResizableProps={{
            ...(ResizableProps || {}),
            defaultSize: {
              height: IFRAME_OVERLAY_DEFAULT_HEIGHT,
              ...(ResizableProps?.defaultSize || {}),
            },
            snap: {
              y: [
                OVERLAY_MIN_HEIGHT,
                IFRAME_OVERLAY_DEFAULT_HEIGHT,
                document.documentElement.clientHeight,
              ],
              ...(ResizableProps?.snap || {}),
            },
          }}
        >
          <div className={classes.mobileHandleWrapper}>
            <div className={classes.mobileHandle}>
              {title ? <b className={classes.mobileTitle}>{title}</b> : null}
            </div>
          </div>
          <IconButton
            size="medium"
            className={`wkp-close-bt ${classes.closeBtn}`}
            title="Close"
            onClick={() => {
              dispatch(setFeatureInfo());
            }}
          >
            <MdClose focusable={false} alt="Close" />
          </IconButton>
          <div
            className={`${classes.menuContent} ${classes.menuContentMobile}`}
          >
            {body}
          </div>
        </Overlay>
      ) : null}
    </div>
  );
}

IframeMenu.propTypes = {
  header: PropTypes.node,
  body: PropTypes.node,
  hide: PropTypes.bool,
  title: PropTypes.node,
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

IframeMenu.defaultProps = {
  header: null,
  body: null,
  hide: false,
  title: null,
  ResizableProps: {},
};

export default IframeMenu;
