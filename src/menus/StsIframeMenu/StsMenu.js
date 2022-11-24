import React, { useRef, useMemo } from 'react';
import { PropTypes } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, IconButton } from '@material-ui/core';
import { MdClose } from 'react-icons/md';
import MenuItem from '../../components/Menu/MenuItem';
import StsValidityLayerSwitcher from './StsValidityLayerSwitcher';
import StsDirektverbindungenLayerSwitcher from './StsDirektverbindungenLayerSwitcher';
import StsDirektVerbindungenFeatureInfo from './StsDirektVerbindungenFeatureInfo';
import StsValidityFeatureInfo from './StsValidityFeatureInfo';
import Overlay from '../../components/Overlay/Overlay';
import { setFeatureInfo } from '../../model/app/actions';

const useStyles = makeStyles(() => {
  return {
    root: {
      '&.wkp-menu-item': {
        position: 'relative',
        marginTop: '0 !important',
        '&:not(:last-child).closed': {
          borderBottom: '1px solid #666 !important',
          borderBottomWidth: '1px !important',
        },
        '&:not(.closed)': {
          boxShadow: '7px 7px 10px -6px rgb(0 0 0 / 40%)',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 'calc(100% - 4px)',
          zIndex: 1000,
        },
      },
    },

    active: {
      border: '2px solid #666 !important',
    },
    layerSwitcher: {
      top: 50,
    },
    menuContent: {
      padding: '0 15px 0',
    },
    fullHeight: {
      '& .wkp-collapsible-vertical': {
        height: 'calc(100vh - 100px)',
      },
    },
    featureInfo: {
      maxHeight: 'calc(90vh - 100px)',
      overflow: 'hidden',
    },
    mobileHandleWrapper: {
      position: 'absolute',
      width: '100%',
      height: 30,
      top: 0,
      right: 0,
    },
    mobileHandle: {
      position: 'fixed',
      backgroundColor: '#f5f5f5',
      width: 'inherit',
      height: 'inherit',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    closeBtn: {
      padding: 8,
    },
  };
});

function StsMenu({
  collapsed,
  onClick,
  activeMenu,
  active,
  title,
  displayMenu,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const activeTopic = useSelector((state) => state.app.activeTopic);
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

  const featureInfos =
    activeMenu === 'sts' ? (
      <StsValidityFeatureInfo />
    ) : (
      <StsDirektVerbindungenFeatureInfo />
    );

  return (
    <>
      {displayMenu && (
        <MenuItem
          onCollapseToggle={onClick}
          className={`${classes.root}${!collapsed ? ` ${classes.active}` : ''}${
            featureInfo?.length && !isMobile ? ` ${classes.fullHeight}` : ''
          }`}
          collapsed={collapsed}
          open={!collapsed}
          ref={ref}
          title={active ? <b>{title}</b> : title}
          menuHeight="calc(100vh - 100px)"
        >
          <div className={classes.menuContent}>
            <div className={classes.layerSwitcher}>{layerSwitcher}</div>
            {!isMobile && featureInfo?.length ? (
              <div className={classes.featureInfo}>{featureInfos}</div>
            ) : null}
          </div>
        </MenuItem>
      )}
      {active && isMobile && featureInfo?.length ? (
        <Overlay
          elements={activeTopic.elements}
          disablePortal={false}
          defaultSize={{ height: 580 }}
          transitionDuration={0}
        >
          {isMobile && (
            <div className={classes.mobileHandleWrapper}>
              <div className={classes.mobileHandle}>
                <IconButton
                  className={`wkp-close-bt ${classes.closeBtn}`}
                  title="Close"
                  onClick={() => {
                    dispatch(setFeatureInfo());
                  }}
                >
                  <MdClose focusable={false} alt="Close" />
                </IconButton>
              </div>
            </div>
          )}
          <div className={classes.menuContent}>{featureInfos}</div>
        </Overlay>
      ) : null}
    </>
  );
}

StsMenu.propTypes = {
  collapsed: PropTypes.bool,
  active: PropTypes.bool,
  activeMenu: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
  displayMenu: PropTypes.bool,
};

StsMenu.defaultProps = {
  collapsed: false,
  onClick: () => {},
  active: false,
  activeMenu: 'sts',
  displayMenu: true,
};

export default React.memo(StsMenu);
