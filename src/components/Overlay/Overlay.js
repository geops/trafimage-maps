import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles, useMediaQuery, Drawer } from '@material-ui/core';
import { Resizable } from 're-resizable';
import FeatureInformation from '../FeatureInformation';
import { setFeatureInfo } from '../../model/app/actions';

const useStyles = makeStyles({
  drawer: {
    '& .wkp-feature-information': {
      height: '100%',
    },
    '& .wkp-feature-information-body': {
      height: 'calc(100% - 36px)',
      display: 'flex',
      flexDirection: 'column',
      '& > div': {
        maxHeight: '100%',
      },
    },
  },
  drawerDesktop: {
    width: 0,
    '& .wkp-feature-information': {
      width: 300,
    },
  },
  drawerDesktopPaper: {
    boxShadow: '-5px 0px 10px -6px rgb(0 0 0 / 40%)',
    height: 'initial',
    borderColor: '#cdcdcd',
    borderStyle: 'solid',
    borderWidth: '1px 0 1px 0',
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
    width: '100%',
    '& .wkp-feature-information': {
      width: '100%',
    },
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
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('xs'));
  const isSmallerThanM = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const activeTopic = useSelector((state) => state.app.activeTopic);
  let featureInfo = useSelector((state) => state.app.featureInfo);
  const [node, setNode] = useState(null);

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
    <div
      ref={(nodee) => {
        setNode(nodee);
      }}
    >
      <Drawer
        className={`${classes.drawer} ${
          isMobile ? classes.drawerMobile : classes.drawerDesktop
        }`}
        classes={{
          paper: isMobile
            ? ''
            : `${[
                classes.drawerDesktopPaper,
                elements.header && !isSmallerThanM ? classes.headerActive : '',
                elements.header && isSmallerThanM ? classes.mobileHeader : '',
                elements.footer ? classes.footerActive : '',
              ].join(' ')}`,
        }}
        anchor={isMobile ? 'bottom' : 'right'}
        open
        onClose={() => {
          dispatch(setFeatureInfo([]));
        }}
        ModalProps={{
          disableEnforceFocus: true,
          container: node,
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
export default React.memo(Overlay);
