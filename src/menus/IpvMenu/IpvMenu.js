/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Divider, makeStyles } from '@material-ui/core';
import IpvFeatureInfo from '../../components/IpvFeatureInfo';
import IpvLayerSwitcher from './IpvLayerSwitcher';
import { setDisplayMenu } from '../../model/app/actions';
import IframeMenu from '../IframeMenu';

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
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  const classes = useStyles({ isMobile });
  const switcher = useMemo(
    () => (
      <div className={classes.wrapper}>
        <IpvLayerSwitcher row={isMobile} />
      </div>
    ),
    [classes.wrapper, isMobile],
  );

  useEffect(() => {
    dispatch(setDisplayMenu(!isMobile));
  }, [isMobile, dispatch]);

  return (
    <IframeMenu
      header={isMobile ? null : switcher}
      body={
        <>
          {isMobile ? switcher : null}
          <Divider />
          <IpvFeatureInfo />
        </>
      }
    />
  );
}

export default IpvMenu;
