import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles, Drawer } from '@material-ui/core';
import { Resizable } from 're-resizable';
import FeatureInformation from '../FeatureInformation';
import { setFeatureInfo } from '../../model/app/actions';

const useStyles = makeStyles({
  drawerRoot: {
    position: 'absolute !important',
  },
  drawer: {
    '& .wkp-feature-information': {
      height: '100%',
      overflow: 'hidden',
    },
    '& .wkp-feature-information-body': {
      height: 'calc(100% - 38px)',
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
  resizeHandler: {
    display: 'flex',
    width: '100%',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const propTypes = {
  appBaseUrl: PropTypes.string.isRequired,
  staticFilesUrl: PropTypes.string.isRequired,
  elements: PropTypes.shape().isRequired,
};

const Overlay = ({ elements, appBaseUrl, staticFilesUrl }) => {
  const classes = useStyles();
  const screenWidth = useSelector((state) => state.app.screenWidth);

  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);

  const isSmallerThanMd = useMemo(() => {
    return ['xs', 's', 'm'].includes(screenWidth);
  }, [screenWidth]);

  const dispatch = useDispatch();
  const activeTopic = useSelector((state) => state.app.activeTopic);
  let featureInfo = useSelector((state) => state.app.featureInfo);

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

  if (!filtered.length) {
    return null;
  }

  return (
    <div>
      <Drawer
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
          disablePortal: true,
          BackdropComponent: () => {
            return null;
          },
        }}
      >
        {isMobile && (
          <Resizable
            enable={{ top: isMobile }}
            defaultSize={{
              height: 250,
            }}
            handleComponent={{
              top: <div className={classes.resizeHandler}>&mdash;</div>,
            }}
          >
            <FeatureInformation
              featureInfo={filtered}
              appBaseUrl={appBaseUrl}
              staticFilesUrl={staticFilesUrl}
            />
          </Resizable>
        )}
        {!isMobile && (
          <FeatureInformation
            featureInfo={filtered}
            appBaseUrl={appBaseUrl}
            staticFilesUrl={staticFilesUrl}
          />
        )}
      </Drawer>
    </div>
  );
};

Overlay.propTypes = propTypes;
export default Overlay;
