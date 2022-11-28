/* eslint-disable no-param-reassign */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  IconButton,
  MenuItem as MuiMenuItem,
} from '@material-ui/core';
import { MdClose } from 'react-icons/md';
import Overlay from '../../components/Overlay/Overlay';
import { setDisplayMenu, setFeatureInfo } from '../../model/app/actions';
import stsLayers from '../../config/ch.sbb.sts';
import { setMaxExtent, setMinZoom } from '../../model/map/actions';
import StsValidityLayerSwitcher from './StsValidityLayerSwitcher';
import StsDirektverbindungenLayerSwitcher from './StsDirektverbindungenLayerSwitcher';
import StsDirektVerbindungenFeatureInfo from './StsDirektVerbindungenFeatureInfo';
import StsValidityFeatureInfo from './StsValidityFeatureInfo';
import MenuItem from '../../components/Menu/MenuItem';
import Select from '../../components/Select';

const boxShadow = '7px 7px 10px -6px rgb(0 0 0 / 40%)';
const useStyles = makeStyles(() => {
  return {
    root: {
      boxShadow: 'border-box',
      marginTop: '0 !important',
      // Hide the MenuItem css, display only the select box.
      border: 'none !important',
      borderBottom: (props) =>
        props.isCollapsed
          ? '1px solid rgba(0, 0, 0, 0.1) !important'
          : undefined,
      '& .MuiPaper-root[style]': {
        // We hardcode left because the menu is too close from the window's border, mui calculate a bad left value.
        // The trafimage menu item is automatically resized so we need this to be able to scroll on small height screen
        overflow: 'auto',
        left: '10px !important',
        boxShadow,
      },

      // Allow multiline display
      '& .MuiSelect-selectMenu, & .MuiMenuItem-root ': {
        textOverflow: 'unset',
        whiteSpace: 'unset',
      },

      // Display proper padding and border inside the list
      '& li:first-child': {
        paddingTop: '6px',
      },
      '& li': {
        paddingTop: '14px',
        paddingBottom: '14px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      },
      '& li:last-child': {
        borderBottom: 'none',
        paddingBottom: '6px',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
    },
    currentValue: {
      display: 'flex',
    },
    container: {
      boxSizing: 'border-box',
      border: (props) => (props.displayMenu ? '2px solid #666' : 'none'),
      boxShadow,
    },
    menuContent: {
      backgroundColor: 'white',
      minHeight: (props) =>
        props.isCollapsed && props.featureSelected && !props.isMobile
          ? 'calc(100vh - 75px)'
          : 'unset',
    },
    menuContentDesktop: {
      padding: '0 15px 0',
      zIndex: 10,
    },
    menuContentMobile: {
      padding: '40px 15px 15px',
    },
    featureInfo: {
      overflow: 'hidden',
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
      marginRight: 10,
    },
    layerSwitcher: {
      padding: '10px 0',
    },
  };
});
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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const classes = useStyles({
    displayMenu,
    isCollapsed,
    featureSelected: featureInfo?.length,
    isMobile,
  });
  const ref = useRef();
  const [node, setNode] = useState();

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

  useEffect(() => {
    if (activeMenu === 'sts') {
      dispatch(
        setMaxExtent([311863.0754, 5439870.429, 1451692.0412, 6392581.5495]), // larger swiss extent
      );
      dispatch(setMinZoom(8));
    } else {
      dispatch(setMinZoom(undefined));
      dispatch(setMaxExtent(null));
    }
  }, [activeMenu, dispatch]);

  useEffect(() => {
    if (featureInfo?.length && isMobile) {
      dispatch(setDisplayMenu(false));
    }
  }, [featureInfo, isMobile, dispatch]);

  const onChange = useCallback(
    (evt) => {
      const { value } = evt.target;
      if (value === 'sts') {
        stsLayers.forEach((layer) => {
          layer.visible = /(ch.sbb.sts.validity|\.data)/.test(layer.key);
        });
        setActiveMenu(value);
        dispatch(setFeatureInfo([]));
      }
      if (value === 'dv') {
        stsLayers.forEach((layer) => {
          layer.visible = /(direktverbindungen|\.data)/.test(layer.key);
        });
        setActiveMenu(value);
        dispatch(setFeatureInfo([]));
      }
    },
    [dispatch],
  );

  return (
    <div className={classes.container}>
      {displayMenu && (
        <MenuItem
          open
          className={`wkp-gb-topic-menu ${classes.root}`}
          collapsed={false}
          ref={ref}
        >
          {activeMenu && (
            <Select
              fullWidth
              data-cy="sts-select"
              value={activeMenu}
              renderValue={() => (
                <span
                  className={`wkp-gb-menu-current-value ${classes.currentValue}`}
                >
                  <b style={{ flex: 2 }} ref={(textNode) => setNode(textNode)}>
                    {activeMenu === 'sts'
                      ? t('Validity of Swiss Travel Pass')
                      : t('Direct trains to Switzerland')}
                  </b>
                </span>
              )}
              onChange={onChange}
              MenuProps={{
                disablePortal: true,
                TransitionProps: {
                  onEnter: (el) => {
                    // Show all the text of the current value
                    node.style.display = 'inline-block';

                    /**
                     * Apply css of the current element
                     * @ignore
                     */
                    const menuEl = el;
                    const parentStyle = window.getComputedStyle(
                      ref.current.parentElement,
                    );
                    menuEl.style.maxWidth = parentStyle.maxWidth;
                    menuEl.style.width = parentStyle.width;
                    menuEl.style.right = parentStyle.right;
                    setIsCollapsed(false);
                  },
                  onExit: () => {
                    // Apply text overflow
                    node.style.display = '-webkit-box';
                    setIsCollapsed(true);
                  },
                },
              }}
            >
              <MuiMenuItem value={activeMenu === 'sts' ? 'dv' : 'sts'}>
                {activeMenu === 'sts'
                  ? t('Direct trains to Switzerland')
                  : t('Validity of Swiss Travel Pass')}
              </MuiMenuItem>
            </Select>
          )}
        </MenuItem>
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
      {isCollapsed && displayMenu && (
        <div className={`${classes.menuContent} ${classes.menuContentDesktop}`}>
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
