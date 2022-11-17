import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
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
  const [activeMenu, setActiveMenu] = useState('sts');
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className={classes.container}>
      <StsIframeMenu
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
