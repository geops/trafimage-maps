import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles, Drawer } from '@material-ui/core';
import { Resizable } from 're-resizable';
import FeatureInformation from '../FeatureInformation';
import { setFeatureInfo } from '../../model/app/actions';
import usePrevious from '../../utils/usePrevious';

const OVERLAY_MIN_HEIGHT = 50;
const useStyles = makeStyles((theme) => ({
  drawerRoot: {
    position: 'absolute !important',
  },
  drawer: {
    '& .wkp-feature-information': {
      height: '100%',
      overflow: 'hidden',
    },
    '& .wkp-feature-information-body': {
      height: 'calc(100% - 50px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      '& > div:first-child': {
        // Normally this div is the root element of a popup component
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      },
    },
  },
  drawerDesktop: {
    pointerEvents: 'none',
    '& .wkp-feature-information': {
      pointerEvents: 'all',
      maxWidth: 400,
      minWidth: 250,
    },
  },
  drawerDesktopPaper: {
    boxShadow: '-5px 0px 10px -6px rgb(0 0 0 / 40%)',
    height: 'initial',
    borderColor: '#cdcdcd',
    borderStyle: 'solid',
    borderWidth: '1px 0 1px 0',
    overflow: 'hidden',
    position: 'absolute',
    pointerEvents: 'all',
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
    pointerEvents: 'none',
    '& .wkp-feature-information': {
      width: '100%',
    },
  },
  drawerMobilePaper: {
    position: 'absolute',
    pointerEvents: 'all',
  },
  resizeHandle: {
    position: 'fixed',
    display: 'flex',
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
    '&::before': {
      content: '""',
      height: 4,
      width: 50,
      top: 12,
      left: '50%',
      transform: 'translate(calc(-50% + 30px), -50%)',
      position: 'absolute',
      borderRadius: 5,
      backgroundColor: theme.colors.lightgray,
    },
  },
  resizeResetButton: {
    width: 'calc(100% - 50px)',
    height: 55,
    zIndex: 10000,
    border: 'none',
    background: 'transparent',
  },
}));

const propTypes = {
  elements: PropTypes.shape().isRequired,
  children: PropTypes.node,
  disablePortal: PropTypes.bool,
  onResize: PropTypes.func,
  defaultSize: PropTypes.shape({
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  transitionDuration: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      appear: PropTypes.number,
      enter: PropTypes.number,
      exit: PropTypes.number,
    }),
  ]),
};

const defaultProps = {
  children: null,
  disablePortal: true,
  defaultSize: { height: 300 },
  transitionDuration: undefined,
  onResize: () => {},
};

const Overlay = ({
  elements,
  children,
  disablePortal,
  defaultSize,
  transitionDuration,
  onResize,
}) => {
  const classes = useStyles();
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const [contentHeight, setContentHeight] = useState(0);
  const resizeRef = useRef(null);

  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);

  const isSmallerThanMd = useMemo(() => {
    return ['xs', 's', 'm'].includes(screenWidth);
  }, [screenWidth]);

  const resetOverlayHeight = useCallback(() => {
    if (resizeRef?.current && contentHeight <= 50) {
      resizeRef.current.resizable.style.height = `${defaultSize.height}px`;
    }
  }, [contentHeight, defaultSize.height]);

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

  if (!featureInfo || !featureInfo.length) {
    return null;
  }

  if (activeTopic.modifyFeatureInfo) {
    featureInfo = activeTopic.modifyFeatureInfo(featureInfo);
  }

  const filtered = featureInfo.filter((info) => {
    const { layer, features } = info;

    if (layer.get('popupComponent') && layer.get('useOverlay')) {
      if (typeof layer.hidePopup === 'function') {
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
        }`}
        classes={{
          root: classes.drawerRoot,
          paper: isMobile
            ? `${classes.drawerMobilePaper}`
            : `${[
                classes.drawerDesktopPaper,
                elements.header && !isSmallerThanMd ? classes.headerActive : '',
                elements.header && isSmallerThanMd ? classes.mobileHeader : '',
                elements.footer ? classes.footerActive : '',
              ].join(' ')}`,
        }}
        anchor={isMobile ? 'bottom' : 'right'}
        open
        onClose={() => {
          dispatch(setFeatureInfo());
        }}
        ModalProps={{
          disableEnforceFocus: true,
          disablePortal,
          container: !disablePortal
            ? document.getElementsByClassName('tm-barrier-free')[0]
            : null,
          BackdropComponent: () => {
            return null;
          },
        }}
      >
        {isMobile && (
          <Resizable
            ref={resizeRef}
            enable={{ top: isMobile }}
            maxHeight="100vh"
            defaultSize={defaultSize}
            minHeight={OVERLAY_MIN_HEIGHT}
            onResize={(evt, side, el) => {
              setContentHeight(el.clientHeight);
              onResize(evt, side, el);
            }}
            snap={{
              y: [
                OVERLAY_MIN_HEIGHT,
                defaultSize.height,
                document.documentElement.clientHeight,
              ],
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
                    {' '}
                  </button>
                </>
              ),
            }}
          >
            {children || <FeatureInformation featureInfo={filtered} />}
          </Resizable>
        )}
        {!isMobile &&
          (children || <FeatureInformation featureInfo={filtered} />)}
      </Drawer>
    </div>
  );
};

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;

export default Overlay;
