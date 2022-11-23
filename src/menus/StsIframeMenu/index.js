import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import StsIframeMenu from './StsIframeMenu';
import StsDirektVerbindungenIframeMenu from './StsDirektVerbindungenIframeMenu';

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
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const [activeMenu, setActiveMenu] = useState('sts');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (featureInfo?.length) {
      setIsCollapsed(false);
    }
  }, [featureInfo]);

  return (
    <div className={classes.container}>
      <StsIframeMenu
        active={activeMenu === 'sts'}
        collapsed={
          activeMenu !== 'sts' || (activeMenu === 'sts' && isCollapsed)
        }
        onClick={() => {
          if (activeMenu !== 'sts') {
            setActiveMenu('sts');
            setIsCollapsed(false);
            return;
          }
          setIsCollapsed(!isCollapsed);
        }}
      />
      <StsDirektVerbindungenIframeMenu
        active={activeMenu === 'dv'}
        collapsed={activeMenu !== 'dv' || (activeMenu === 'dv' && isCollapsed)}
        onClick={() => {
          if (activeMenu !== 'dv') {
            setActiveMenu('dv');
            setIsCollapsed(false);
            return;
          }
          setIsCollapsed(!isCollapsed);
        }}
      />
    </div>
  );
}

StsMenu.propTypes = {};

export default StsMenu;
