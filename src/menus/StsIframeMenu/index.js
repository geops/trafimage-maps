/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import StsIframeMenu from './StsIframeMenu';
import stsLayers from '../../config/ch.sbb.sts.iframe';

const useStyles = makeStyles(() => {
  return {
    container: {
      border: '1px solid gray',
      boxShadow: '7px 7px 10px -6px rgb(0 0 0 / 40%)',
    },
  };
});
function StsMenu() {
  const classes = useStyles();
  const { t } = useTranslation();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const [activeMenu, setActiveMenu] = useState('sts');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (featureInfo?.length) {
      setIsCollapsed(false);
    }
  }, [featureInfo]);

  const onClick = useCallback(
    (key) => {
      if (key === 'sts') {
        if (activeMenu !== key) {
          stsLayers.forEach((layer) => {
            layer.visible = /(ch.sbb.sts.validity|\.data)/.test(layer.key);
          });
          setActiveMenu(key);
          setIsCollapsed(false);
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
          return;
        }
        setIsCollapsed(!isCollapsed);
      }
    },
    [activeMenu, isCollapsed],
  );

  return (
    <div className={classes.container}>
      <StsIframeMenu
        active={activeMenu === 'sts'}
        activeMenu={activeMenu}
        collapsed={
          activeMenu !== 'sts' || (activeMenu === 'sts' && isCollapsed)
        }
        onClick={() => onClick('sts')}
        title={t('Validity of Swiss Travel Pass')}
      />
      <StsIframeMenu
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
