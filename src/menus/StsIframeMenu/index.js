/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import StsIframeMenu from './StsIframeMenu';
import stsLayers from '../../config/ch.sbb.sts.iframe';
import { setDisplayMenu, setFeatureInfo } from '../../model/app/actions';

const useStyles = makeStyles(() => {
  return {
    container: {
      border: (props) => (props.displayMenu ? '1px solid #666' : 'none'),
      boxShadow: '7px 7px 10px -6px rgb(0 0 0 / 40%)',
      boxSizing: 'border-box',
    },
  };
});
function StsMenu() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const displayMenu = useSelector((state) => state.app.displayMenu);
  const classes = useStyles({ displayMenu });
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  const [activeMenu, setActiveMenu] = useState('sts');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (featureInfo?.length) {
      setIsCollapsed(false);
    }
    if (featureInfo?.length && isMobile) {
      dispatch(setDisplayMenu(false));
    }
  }, [featureInfo, isMobile, dispatch]);

  const onClick = useCallback(
    (key) => {
      if (key === 'sts') {
        if (activeMenu !== key) {
          stsLayers.forEach((layer) => {
            layer.visible = /(ch.sbb.sts.validity|\.data)/.test(layer.key);
          });
          setActiveMenu(key);
          setIsCollapsed(false);
          dispatch(setFeatureInfo([]));
          return;
        }
        setIsCollapsed(!isCollapsed);
      }
      if (key === 'dv') {
        if (activeMenu !== key) {
          stsLayers.forEach((layer) => {
            layer.visible = /(direktverbindungen|\.data)/.test(layer.key);
          });
          setActiveMenu(key);
          setIsCollapsed(false);
          dispatch(setFeatureInfo([]));
          return;
        }
        setIsCollapsed(!isCollapsed);
      }
    },
    [activeMenu, isCollapsed, dispatch],
  );

  return (
    <div className={classes.container}>
      <StsIframeMenu
        displayMenu={displayMenu}
        active={activeMenu === 'sts'}
        activeMenu={activeMenu}
        collapsed={
          activeMenu !== 'sts' || (activeMenu === 'sts' && isCollapsed)
        }
        onClick={() => onClick('sts')}
        title={t('Validity of Swiss Travel Pass')}
      />
      <StsIframeMenu
        displayMenu={displayMenu}
        active={activeMenu === 'dv'}
        activeMenu={activeMenu}
        collapsed={activeMenu !== 'dv' || (activeMenu === 'dv' && isCollapsed)}
        onClick={() => onClick('dv')}
        title={t('Direct trains to Switzerland')}
      />
    </div>
  );
}

StsMenu.propTypes = {};

export default StsMenu;
