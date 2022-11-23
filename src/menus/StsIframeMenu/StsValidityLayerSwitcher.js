import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormGroup, FormControlLabel, makeStyles } from '@material-ui/core';
import SBBSwitch from '../../components/SBBSwitch/SBBSwitch';
import { highlights, gttos, premium } from '../../config/ch.sbb.sts.iframe';
import { setFeatureInfo } from '../../model/app/actions';

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
    featureInfos: {
      border: '1px solid gray',
    },
    featureInfoItem: {
      padding: 15,
      borderBottom: '1px solid #eee',
    },
    imageLine: {
      '& img': {
        width: '100%',
      },
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

function StsValidityLayerSwitcher() {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const layers = useSelector((state) => state.map.layers);

  const switchLayers = useMemo(() => {
    return layers?.filter(
      (layer) =>
        layer.get('group') === (gttos.get('group') || premium.get('group')),
    );
  }, [layers]);
  const highlightsLayer = useMemo(() => {
    return layers?.find((layer) => layer.key === highlights.key);
  }, [layers]);

  const [switchValue, setSwitchValue] = useState(
    switchLayers.find((layer) => layer.visible)?.key || null,
  );
  const [highlightsVisible, setHighlightsVisible] = useState(
    highlightsLayer?.visible,
  );

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
      dispatch(setFeatureInfo([]));
    },
    [highlightsLayer, dispatch],
  );

  return (
    <div className={classes.layers}>
      <FormGroup>
        {switchLayers.map((layer) => {
          const isActive = switchValue === layer.key;
          return (
            <FormControlLabel
              label={isActive ? <b>{t(layer.name)}</b> : t(layer.name)}
              checked={isActive}
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
              onChange={(evt) => onHighlightChange(evt, highlightsLayer.key)}
            />
          }
        />
      </FormGroup>
    </div>
  );
}

StsValidityLayerSwitcher.propTypes = {};

export default StsValidityLayerSwitcher;
