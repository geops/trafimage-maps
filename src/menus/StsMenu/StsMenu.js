/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  withStyles,
  MenuItem as MuiMenuItem,
  Menu,
  Button,
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StsValidityLayerSwitcher from './StsValidityLayerSwitcher';
import StsDirektverbindungenLayerSwitcher from './StsDirektverbindungenLayerSwitcher';
import IpvFeatureInfo from '../../components/IpvFeatureInfo';
import StsValidityFeatureInfo from './StsValidityFeatureInfo';
import IframeMenu from '../IframeMenu';
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
    layerSwitcher: {
      padding: '15px 10px',
    },
  };
});

const updateLayers = (key = 'sts') => {
  if (key === 'sts') {
    stsLayers.forEach((layer) => {
      layer.visible =
        /(ch\.sbb\.sts\.validity(?!\.(highlights|premium)$)|\.data$)/.test(
          layer.key,
        );
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
  const classes = useStyles();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const layers = useSelector((state) => state.map.layers);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  const [activeMenu, setActiveMenu] = useState('sts');
  const [anchorEl, setAnchorEl] = useState();

  useEffect(() => {
    // Activate the correct menu on load of the topic.
    const isDirektVerbindungLayersVisible = layers?.find((layer) => {
      return /direktverbindungen/.test(layer.key) && layer.visible;
    });
    if (isDirektVerbindungLayersVisible) {
      setActiveMenu('dv');
    }
  }, [layers]);

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
        <IpvFeatureInfo />
      ),
    [activeMenu, featureInfo],
  );

  useEffect(() => {
    if (featureInfo?.length) {
      dispatch(setDisplayMenu(!isMobile));
    }
  }, [featureInfo, isMobile, dispatch]);

  const onChange = (key) => {
    updateLayers(key);
    setActiveMenu(key);
    dispatch(setFeatureInfo([]));
    setAnchorEl(null);
  };

  return (
    <IframeMenu
      header={
        activeMenu && (
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
            <div className={classes.layerSwitcher}>{layerSwitcher}</div>
          </>
        )
      }
      body={featureInfos}
    />
  );
}

StsTopicMenu.propTypes = {};

export default StsTopicMenu;
