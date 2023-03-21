/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Divider } from '@material-ui/core';
import IpvFeatureInfo from '../../components/IpvFeatureInfo';
import IpvLayerSwitcher from './IpvLayerSwitcher';
import { setDisplayMenu } from '../../model/app/actions';
import IframeMenu from '../IframeMenu';

function IpvMenu() {
  const dispatch = useDispatch();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);

  useEffect(() => {
    if (featureInfo?.length) {
      dispatch(setDisplayMenu(!isMobile));
    }
  }, [featureInfo, isMobile, dispatch]);

  return (
    <IframeMenu
      header={<IpvLayerSwitcher />}
      body={
        <>
          {isMobile ? <IpvLayerSwitcher /> : null}
          <Divider />
          <IpvFeatureInfo />
        </>
      }
    />
  );
}

export default IpvMenu;
