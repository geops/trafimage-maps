/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, IconButton } from '@material-ui/core';
import { MdClose } from 'react-icons/md';
import Overlay from '../../components/Overlay/Overlay';
import { setDisplayMenu, setFeatureInfo } from '../../model/app/actions';

const boxShadow =
  '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)';

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
      overflow: 'hidden',
      // border: (props) => (props.displayMenu ? '2px solid #666' : 'none'),
      boxShadow,
      borderRadius: 8,
    },
    menuContent: {
      backgroundColor: 'white',
      height: (props) =>
        props.featureSelected && !props.isMobile
          ? 'calc(100vh - 30px)'
          : 'unset',
    },
    menuContentMobile: {
      padding: '30px 0 0',
    },
    featureInfo: {
      overflow: 'hidden',
      height: (props) => `calc(100vh - ${props.headerHeight + 30}px)`,
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
    hide: {
      display: 'none',
    },
  };
});

function IframeMenu({ header, body, hide }) {
  const dispatch = useDispatch();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const displayMenu = useSelector((state) => state.app.displayMenu);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const classes = useStyles({
    displayMenu,
    featureSelected: featureInfo?.length,
    isMobile,
    headerHeight,
  });

  useEffect(() => {
    if (featureInfo?.length) {
      dispatch(setDisplayMenu(!isMobile));
    }
  }, [featureInfo, isMobile, dispatch]);

  return (
    <div className={`${classes.container}${hide ? ` ${classes.hide}` : ''}`}>
      {displayMenu && (
        <div className={classes.menuContent}>
          <div
            className={classes.menuHeader}
            ref={(el) => setHeaderHeight(el?.clientHeight)}
          >
            {header}
          </div>
          {!isMobile && featureInfo?.length ? (
            <div className={classes.featureInfo}>{body}</div>
          ) : null}
        </div>
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
            {body}
          </div>
        </Overlay>
      ) : null}
    </div>
  );
}

IframeMenu.propTypes = {
  header: PropTypes.node,
  body: PropTypes.node,
  hide: PropTypes.bool,
};

IframeMenu.defaultProps = {
  header: null,
  body: null,
  hide: false,
};

export default IframeMenu;
