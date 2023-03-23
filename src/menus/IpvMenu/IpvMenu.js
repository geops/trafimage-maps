/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Divider, makeStyles } from '@material-ui/core';
import IpvFeatureInfo from '../../components/IpvFeatureInfo';
import IpvLayerSwitcher from './IpvLayerSwitcher';
import { setDisplayMenu } from '../../model/app/actions';
import IframeMenu from '../IframeMenu';
import { IPV_TOPIC_KEY } from '../../utils/constants';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      padding: '15px 10px',
    },
  };
});

function IpvMenu() {
  const dispatch = useDispatch();
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const layers = useSelector((state) => state.map.layers);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  const classes = useStyles({ isMobile });

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

  const ipvMainLayer = layers.find((l) => l.key === IPV_TOPIC_KEY);

  console.log(ipvMainLayer.allFeatures);

  useEffect(() => {
    dispatch(setDisplayMenu(!isMobile));
  }, [isMobile, dispatch]);

  return (
    <IframeMenu
      hide={hideMenu}
      header={showSwitcher ? switcher : null}
      body={
        <>
          {showSwitcher && isMobile ? switcher : null}
          {showSwitcher ? <Divider /> : null}
          <IpvFeatureInfo />
        </>
      }
    />
  );
}

export default IpvMenu;
