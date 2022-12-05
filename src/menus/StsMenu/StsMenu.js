/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  withStyles,
  IconButton,
  MenuItem as MuiMenuItem,
  Menu,
  Button,
} from '@material-ui/core';
import { MdClose } from 'react-icons/md';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Overlay from '../../components/Overlay/Overlay';
import StsValidityLayerSwitcher from './StsValidityLayerSwitcher';
import StsDirektverbindungenLayerSwitcher from './StsDirektverbindungenLayerSwitcher';
import StsDirektVerbindungenFeatureInfo from './StsDirektVerbindungenFeatureInfo';
import StsValidityFeatureInfo from './StsValidityFeatureInfo';
import stsLayers from '../../config/ch.sbb.sts';
import { setDisplayMenu, setFeatureInfo } from '../../model/app/actions';

const boxShadow =
  '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)';

const StyledMenu = withStyles(() => ({
  paper: {
    boxShadow,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: 0,
  },
  list: {
    minWidth: 230,
    padding: '5px 0',
  },
}))(Menu);

const StyledMenuItem = withStyles({
  root: {
    color: '#000000',
    padding: 15,
  },
})(MuiMenuItem);

const useStyles = makeStyles(() => {
  return {
    dropdownToggler: {
      backgroundColor: 'white',
      padding: '6px 10px',
      '&:hover': {
        backgroundColor: 'white',
      },
    },
    container: {
      backgroundColor: 'white',
      boxSizing: 'border-box',
      border: (props) => (props.displayMenu ? '2px solid #666' : 'none'),
      boxShadow,
    },
    menuContent: {
      backgroundColor: 'white',
      height: (props) =>
        props.featureSelected && !props.isMobile
          ? 'calc(100vh - 80px)'
          : 'unset',
    },
    menuContentMobile: {
      padding: '30px 0 0',
    },
    featureInfo: {
      overflow: 'hidden',
      height: (props) =>
        props.activeMenu === 'dv' ? 'calc(100% - 98px)' : 'calc(100% - 105px)',
      '& > div': {
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: 6,
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.1)',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0, 0, 0, 0.4)',
        },
      },
    },
    mobileHandleWrapper: {
      position: 'absolute',
      width: '100%',
      height: 30,
      top: 0,
      right: 0,
      zIndex: 1000,
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
      marginRight: 5,
    },
    layerSwitcher: {
      padding: '15px 10px',
    },
  };
});

const updateLayers = (key = 'sts') => {
  if (key === 'sts') {
    stsLayers.forEach((layer) => {
      layer.visible = /(ch.sbb.sts.validity|\.data)/.test(layer.key);
    });
  }
  if (key === 'dv') {
    stsLayers.forEach((layer) => {
      layer.visible = /(direktverbindungen|\.data)/.test(layer.key);
    });
  }
};
function StsTopicMenu() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const displayMenu = useSelector((state) => state.app.displayMenu);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  const [activeMenu, setActiveMenu] = useState('sts');
  const [anchorEl, setAnchorEl] = useState();
  const classes = useStyles({
    displayMenu,
    isOpen: !!anchorEl,
    featureSelected: featureInfo?.length,
    isMobile,
    activeMenu,
  });

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
        <StsValidityFeatureInfo menuOpen={!featureInfo} />
      ) : (
        <StsDirektVerbindungenFeatureInfo />
      ),
    [activeMenu, featureInfo],
  );

  useEffect(() => {
    if (featureInfo?.length) {
      dispatch(setDisplayMenu(!isMobile));
    }
  }, [featureInfo, isMobile, dispatch]);

  const onChange = useCallback(
    (key) => {
      updateLayers(key);
      setActiveMenu(key);
      dispatch(setFeatureInfo([]));
      setAnchorEl(null);
    },
    [dispatch],
  );

  return (
    <div className={classes.container}>
      {displayMenu && activeMenu && (
        <>
          <Button
            color="secondary"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={(evt) => setAnchorEl(evt.currentTarget)}
            endIcon={anchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            className={classes.dropdownToggler}
            data-testid="sts-menu-opener"
          >
            <b>
              {activeMenu === 'sts'
                ? t('Validity of Swiss Travel Pass')
                : t('Direct trains to Switzerland')}
            </b>
          </Button>
          <StyledMenu
            keepMounted
            open={!!anchorEl}
            data-cy="sts-select"
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            transitionDuration="auto"
            MenuListProps={{
              autoFocusItem: false,
            }}
            data-testid="sts-menu-popover"
          >
            <StyledMenuItem
              disabled={activeMenu === 'sts'}
              onClick={() => onChange('sts')}
              data-testid="sts-menu-sts"
            >
              {t('Validity of Swiss Travel Pass')}
            </StyledMenuItem>
            <StyledMenuItem
              disabled={activeMenu === 'dv'}
              onClick={() => onChange('dv')}
              data-testid="sts-menu-dv"
            >
              {t('Direct trains to Switzerland')}
            </StyledMenuItem>
          </StyledMenu>
        </>
      )}
      {isMobile && featureInfo?.length ? (
        <Overlay
          elements={activeTopic.elements}
          disablePortal={false}
          transitionDuration={0}
          defaultSize={{ height: 400 }}
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
          <div
            className={`${classes.menuContent} ${classes.menuContentMobile}`}
          >
            {featureInfos}
          </div>
        </Overlay>
      ) : null}
      {displayMenu && (
        <div className={classes.menuContent}>
          <div className={classes.layerSwitcher}>{layerSwitcher}</div>
          {!isMobile && featureInfo?.length ? (
            <div className={classes.featureInfo}>{featureInfos}</div>
          ) : null}
        </div>
      )}
    </div>
  );
}

StsTopicMenu.propTypes = {};

export default StsTopicMenu;
