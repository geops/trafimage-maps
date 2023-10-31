/* eslint-disable no-param-reassign */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Box, IconButton } from '@material-ui/core';
import { MdClose } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import IframeMenu from '../IframeMenu';
import { RailplusPopup } from '../../popups';
import { setFeatureInfo } from '../../model/app/actions';
import useIsMobile from '../../utils/useIsMobile';
import usePanCenterFeature from '../../utils/usePanCenterFeature';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      padding: 15,
    },
    listHeader: {
      paddingLeft: (props) => (props.isMobile ? 0 : 15),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f5f5f5',
      borderBottom: `1px solid #F0F0F0`,
    },
    closeButton: {
      paddingRight: 15,
    },
  };
});

function RailplusMenu() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const classes = useStyles({ isMobile });
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const feature = featureInfo[0]?.features[0];
  const layer = featureInfo[0]?.layer;
  usePanCenterFeature();

  if (!feature || !layer) {
    return null;
  }

  return (
    <IframeMenu
      ResizableProps={{
        defaultSize: { height: 'auto' },
      }}
      title={
        <Box className={classes.listHeader}>
          <b>{t(layer.key)}</b>
          {!isMobile && (
            <IconButton
              size="medium"
              className={`${classes.closeButton} wkp-close-bt`}
              title={t('Schliessen')}
              onClick={() => {
                dispatch(setFeatureInfo());
              }}
            >
              <MdClose focusable={false} alt={t('Schliessen')} />
            </IconButton>
          )}
        </Box>
      }
      body={
        <div className={classes.wrapper}>
          <RailplusPopup feature={feature} layer={layer} />
        </div>
      }
    />
  );
}

export default RailplusMenu;
