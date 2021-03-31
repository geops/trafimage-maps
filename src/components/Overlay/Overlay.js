import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles, useMediaQuery, Drawer } from '@material-ui/core';
import { Resizable } from 're-resizable';
import FeatureInformation from '../FeatureInformation';
import { setFeatureInfo } from '../../model/app/actions';

const useStyles = makeStyles({
  drawer: {
    width: 300,
    '& .wkp-feature-information': {
      width: 300,
    },
  },
  drawerMobile: {
    width: '100%',
    '& .wkp-feature-information': {
      width: '100%',
    },
  },
});

const Overlay = ({ appBaseUrl, staticFilesUrl }) => {
  const classes = useStyles();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
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
        className={isMobile ? classes.drawerMobile : classes.drawer}
        anchor={isMobile ? 'bottom' : 'left'}
        open
        onClose={() => {
          dispatch(setFeatureInfo([]));
        }}
        ModalProps={{
          container: node,
          BackdropProps: {
            invisible: true,
          },
          BackdropComponent: () => {
            return null;
          },
        }}
      >
        <Resizable
          enable={{ top: isMobile }}
          handleComponent={{
            top: <div>AAAAAAAAAAAa</div>,
          }}
        >
          <FeatureInformation
            featureInfo={filtered}
            appBaseUrl={appBaseUrl}
            staticFilesUrl={staticFilesUrl}
          />
        </Resizable>
      </Drawer>
    </div>
  );
};

Overlay.propTypes = {
  appBaseUrl: PropTypes.string,
  staticFilesUrl: PropTypes.string,
};

Overlay.defaultProps = {
  appBaseUrl: null,
  staticFilesUrl: null,
};

export default React.memo(Overlay);
