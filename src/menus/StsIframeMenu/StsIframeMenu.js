import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { PropTypes } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  withStyles,
  makeStyles,
  FormGroup,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import MenuItem from '../../components/Menu/MenuItem';
import usePrevious from '../../utils/usePrevious';
import GeltungsbereichePopup from '../../popups/GeltungsbereicheGaPopup/GeltungsbereicheGaPopup';
import { setDialogPosition, setFeatureInfo } from '../../model/app/actions';

const useStyles = makeStyles(() => {
  return {
    root: {
      '&.wkp-menu-item': {
        marginTop: '0 !important',
      },
    },
    menuContent: {
      padding: '5px 10px 15px 15px',
    },
    featureInfos: {
      border: '1px solid gray',
    },
  };
});

const SBBSwitch = withStyles((theme) => ({
  root: {
    width: 40,
    height: 24,
    padding: 0,
    margin: 10,
    overflow: 'visible',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(14px)',
      color: 'white',
      '& + $track': {
        opacity: 1,
        backgroundColor: '#eb0000',
      },
    },
  },
  thumb: {
    width: 22,
    height: 22,
    boxShadow:
      '0 1px 1px 0 rgb(0 0 0 / 7%), 0 0 1px 1px rgb(0 0 0 / 11%), 0 4px 2px 0 rgb(0 0 0 / 10%), 0 4px 9px 2px rgb(0 0 0 / 8%)',
  },
  track: {
    border: `1px solid #e5e5e5`,
    borderRadius: 24 / 2,
    opacity: 1,
    backgroundColor: 'white',
  },
  checked: {},
}))(Switch);

function StsIframeMenu({ collapsed, onClick }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const layers = useSelector((state) => state.map.layers);
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const switchLayers = useMemo(() => {
    return layers?.filter(
      (layer) => layer.get('group') === 'ch.sbb.sts.sts.group',
    );
  }, [layers]);
  const highlightsLayer = useMemo(() => {
    return layers?.find((layer) => layer.key === 'ch.sbb.sts.sts.highlights');
  }, [layers]);
  const [switchValue, setSwitchValue] = useState(
    switchLayers.find((layer) => layer.visible)?.key || null,
  );
  const [infoKey, setInfoKey] = useState(undefined);
  const [highlightsVisible, setHighlightsVisible] = useState(
    highlightsLayer.visible,
  );
  const ref = useRef();
  const prevFeatureInfo = usePrevious(featureInfo);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);

  const allFeatures = useMemo(() => {
    let features = [];
    if (featureInfo?.length) {
      featureInfo.forEach((info) => {
        features = [...features, ...info.features];
      });
    }
    return features;
  }, [featureInfo]);

  console.log(allFeatures);

  const onSwitchClick = useCallback(
    (evt, key) => {
      const clickedLayer = switchLayers.find((layer) => layer.key === key);
      const otherLayer = switchLayers.find((layer) => layer.key !== key);
      if (!clickedLayer.visible) {
        clickedLayer.visible = true;
        otherLayer.visible = false;
        setSwitchValue(clickedLayer.key);
        dispatch(setFeatureInfo([]));
        return;
      }
      clickedLayer.visible = false;
      setSwitchValue(null);
      dispatch(setFeatureInfo([]));
    },
    [switchLayers, dispatch],
  );

  const onHighlightChange = useCallback(
    (evt) => {
      highlightsLayer.visible = evt.target.checked;
      setHighlightsVisible(evt.target.checked);
    },
    [highlightsLayer],
  );

  useEffect(() => {
    dispatch(setDialogPosition({ x: 390, y: 17 }));
  }, [dispatch]);

  useEffect(() => {
    if (featureInfo !== prevFeatureInfo) {
      setInfoKey();
    }
    if (featureInfo?.length && infoKey === undefined) {
      setInfoKey(featureInfo[0].features[0]?.get('uid'));
    }
  }, [featureInfo, prevFeatureInfo, infoKey]);

  return (
    <MenuItem
      onCollapseToggle={onClick}
      className={`wkp-gb-topic-menu ${classes.root}`}
      collapsed={collapsed}
      ref={ref}
      title={t('Validity of Swiss Travel Pass')}
    >
      <div className={classes.menuContent}>
        <div className={classes.layers}>
          <FormGroup>
            {switchLayers.map((layer) => {
              const active = switchValue === layer.key;
              return (
                <FormControlLabel
                  label={active ? <b>{t(layer.name)}</b> : t(layer.name)}
                  checked={active}
                  control={
                    <SBBSwitch
                      key={layer.key}
                      value={layer.key}
                      onChange={(evt) => onSwitchClick(evt, layer.key)}
                    />
                  }
                />
              );
            })}
            <FormControlLabel
              label={
                highlightsVisible ? (
                  <b>{t(highlightsLayer.name)}</b>
                ) : (
                  t(highlightsLayer.name)
                )
              }
              checked={highlightsVisible}
              control={
                <SBBSwitch
                  key={highlightsLayer.key}
                  value={highlightsLayer.key}
                  onChange={(evt) =>
                    onHighlightChange(evt, highlightsLayer.key)
                  }
                />
              }
            />
          </FormGroup>
        </div>
        {!isMobile && featureInfo?.length ? (
          <>
            <GeltungsbereichePopup
              feature={featureInfo[0].features}
              layer={[featureInfo[0].layer]}
              renderValidityFooter={false}
            />
            <div className={classes.featureInfos}>
              {allFeatures.map((feat) => {
                return (
                  <MenuItem
                    onCollapseToggle={(open) =>
                      setInfoKey(open ? null : feat.get('uid'))
                    }
                    className={`wkp-gb-topic-menu ${classes.root}`}
                    collapsed={infoKey !== feat.get('uid')}
                    title={
                      feat.get('touristische_linie') ||
                      feat.get('route_names_gttos') ||
                      feat.get('hauptlinie')
                    }
                  >
                    <div>Viel Info</div>
                  </MenuItem>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </MenuItem>
  );
}

StsIframeMenu.propTypes = {
  collapsed: PropTypes.bool,
  onClick: PropTypes.func,
};

StsIframeMenu.defaultProps = {
  collapsed: false,
  onClick: () => {},
};

export default React.memo(StsIframeMenu);
