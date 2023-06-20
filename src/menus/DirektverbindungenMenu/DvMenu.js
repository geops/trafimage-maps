/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Divider, makeStyles } from '@material-ui/core';
import DvFeatureInfo from '../../config/ch.sbb.direktverbindungen/DvFeatureInfo';
import DvLayerSwitcher from './DvLayerSwitcher';
import { setDisplayMenu } from '../../model/app/actions';
import IframeMenu from '../IframeMenu';
import useIsMobile from '../../utils/useIsMobile';
import useHighlightLayer from '../../utils/useHighlightLayer';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      padding: '15px 10px',
    },
  };
});

function DvMenu() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const topic = useSelector((state) => state.app.activeTopic);
  const highlightLayer = useSelector((state) => state.map.highlightLayer);
  const isMobile = useIsMobile();

  const urlSearch = useMemo(
    () => new URLSearchParams(window.location.search),
    [],
  );

  const switcher = useMemo(
    () => (
      <div className={classes.wrapper}>
        <DvLayerSwitcher row={isMobile} />
      </div>
    ),
    [classes.wrapper, isMobile],
  );

  const showSwitcher = useMemo(() => {
    // Completely hide the switcher via the permalink
    return urlSearch.get('direktverbindungen.menu') !== 'false';
  }, [urlSearch]);

  const hideMenu = useMemo(() => {
    // Hide the menu if the switcher is hidden and no features are selected
    return !showSwitcher && !featureInfo?.length;
  }, [featureInfo?.length, showSwitcher]);

  useEffect(() => {
    // Hide menu and zoom buttons on mobile
    dispatch(setDisplayMenu(!isMobile));
    const zoomControls = document
      .querySelectorAll(`.${topic.key.replaceAll('.', '-')}.map-controls`)[0]
      ?.querySelectorAll('.rs-zooms-bar')[0];
    if (zoomControls) {
      zoomControls.style.display = isMobile ? 'none' : 'block';
    }
  }, [isMobile, topic, dispatch]);

  // Hook to highlight map features
  useHighlightLayer(featureInfo, highlightLayer);

  return (
    <IframeMenu
      hide={hideMenu}
      header={showSwitcher ? switcher : null}
      body={
        <>
          {showSwitcher && isMobile ? switcher : null}
          {showSwitcher ? <Divider /> : null}
          <DvFeatureInfo filterByType />
        </>
      }
    />
  );
}

export default DvMenu;
