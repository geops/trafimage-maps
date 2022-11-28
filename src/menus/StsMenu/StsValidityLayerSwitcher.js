import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormGroup, FormControlLabel } from '@material-ui/core';
import SBBSwitch from '../../components/SBBSwitch/SBBSwitch';
import stsLayers, { highlights, gttos, premium } from '../../config/ch.sbb.sts';
import { setFeatureInfo } from '../../model/app/actions';

function StsValidityLayerSwitcher() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const switchLayers = useMemo(() => {
    return stsLayers?.filter(
      (layer) =>
        layer.get('group') === (gttos.get('group') || premium.get('group')),
    );
  }, []);
  const highlightsLayer = useMemo(() => {
    return stsLayers?.find((layer) => layer.key === highlights.key);
  }, []);

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
    <>
      <FormGroup>
        {switchLayers.map((layer) => {
          const isActive = switchValue === layer.key;
          return (
            <FormControlLabel
              key={layer.key}
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
    </>
  );
}

StsValidityLayerSwitcher.propTypes = {};

export default StsValidityLayerSwitcher;
