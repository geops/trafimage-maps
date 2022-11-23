import React, { useRef, useMemo } from 'react';
import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import MenuItem from '../../components/Menu/MenuItem';
import StsValidityLayerSwitcher from './StsValidityLayerSwitcher';
import StsDirektverbindungenLayerSwitcher from './StsDirektverbindungenLayerSwitcher';
import StsDirektVerbindungenFeatureInfo from './StsDirektVerbindungenFeatureInfo';
import StsValidityFeatureInfo from './StsValidityFeatureInfo';
import Overlay from '../../components/Overlay/Overlay';

const useStyles = makeStyles(() => {
  return {
    root: {
      '&.wkp-menu-item': {
        marginTop: '0 !important',
        '&:not(:last-child)': {
          borderBottom: '1px solid gray !important',
          borderBottomWidth: '1px !important',
        },
        '&.open': {
          borderBottom: '1px solid #eee',
        },
      },
    },
    menuContent: {
      padding: 15,
    },
    mobileHandleWrapper: {
      position: 'absolute',
      width: '100%',
      height: 20,
      top: 0,
      right: 0,
    },
    mobileHandle: {
      position: 'fixed',
      backgroundColor: '#f5f5f5',
      width: 'inherit',
      height: 'inherit',
    },
  };
});

function StsIframeMenu({ collapsed, onClick, activeMenu, active, title }) {
  const classes = useStyles();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  const ref = useRef();

  const layerSwitcher = useMemo(
    () =>
      activeMenu === 'sts' ? (
        <StsValidityLayerSwitcher />
      ) : (
        <StsDirektverbindungenLayerSwitcher />
      ),
    [activeMenu],
  );

  const featureInfos = useMemo(
    () =>
      activeMenu === 'sts' ? (
        <StsValidityFeatureInfo />
      ) : (
        <StsDirektVerbindungenFeatureInfo />
      ),
    [activeMenu],
  );

  return (
    <>
      <MenuItem
        onCollapseToggle={onClick}
        className={`wkp-gb-topic-menu ${classes.root}`}
        collapsed={collapsed}
        ref={ref}
        title={active ? <b>{title}</b> : title}
      >
        <div className={classes.menuContent}>
          {layerSwitcher}
          {!isMobile && featureInfo?.length ? featureInfos : null}
        </div>
      </MenuItem>
      {isMobile && featureInfo?.length ? (
        <Overlay disablePortal={false}>
          {isMobile && (
            <div className={classes.mobileHandleWrapper}>
              <div className={classes.mobileHandle} />
            </div>
          )}
          <div className={classes.menuContent}>{featureInfos}</div>
        </Overlay>
      ) : null}
    </>
  );
}

StsIframeMenu.propTypes = {
  collapsed: PropTypes.bool,
  active: PropTypes.bool,
  activeMenu: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
};

StsIframeMenu.defaultProps = {
  collapsed: false,
  onClick: () => {},
  active: false,
  activeMenu: 'sts',
};

export default React.memo(StsIframeMenu);
