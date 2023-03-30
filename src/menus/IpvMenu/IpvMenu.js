/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import IpvFeatureInfo from '../../config/ch.sbb.ipv/IpvFeatureInfo';
import IpvLayerSwitcher from './IpvLayerSwitcher';
import { setDisplayMenu } from '../../model/app/actions';
import IframeMenu from '../IframeMenu';
import FadeShadow from '../../components/FadeShadow';
import { WKP_ZOOM_ELEMENT_ID } from '../../utils/constants';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      padding: '15px 10px',
    },
  };
});

function IpvMenu() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);

  const urlSearch = useMemo(
    () => new URLSearchParams(window.location.search),
    [],
  );

  const switcher = useMemo(
    () => (
      <div className={classes.wrapper}>
        <IpvLayerSwitcher row={isMobile} />
      </div>
    ),
    [classes.wrapper, isMobile],
  );

  const hideMenu = useMemo(() => {
    return urlSearch.get('ipvmenu') === 'false' && !featureInfo?.length;
  }, [featureInfo?.length, urlSearch]);

  const showSwitcher = useMemo(() => {
    return urlSearch.get('ipvmenu') !== 'false';
  }, [urlSearch]);

  useEffect(() => {
    // Hide menu and zoom buttons on mobile
    dispatch(setDisplayMenu(!isMobile));
    const zoomControls = document.getElementById(WKP_ZOOM_ELEMENT_ID);
    if (zoomControls) {
      zoomControls.style.display = isMobile ? 'none' : 'block';
    }
  }, [isMobile, dispatch]);

  return (
    <IframeMenu
      hide={hideMenu}
      header={showSwitcher ? switcher : null}
      body={
        <>
          {showSwitcher && isMobile ? switcher : null}
          {showSwitcher ? <FadeShadow /> : null}
          <IpvFeatureInfo hasTopShadow={showSwitcher} filterByType />
        </>
      }
    />
  );
}

export default IpvMenu;
