/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormGroup, FormControlLabel } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { unByKey } from 'ol/Observable';
import SBBSwitch from '../../components/SBBSwitch/SBBSwitch';
import {
  direktverbindungenDay,
  direktverbindungenNight,
} from '../../config/ch.sbb.sts';
import { setFeatureInfo } from '../../model/app/actions';

function StsDirektverbindungenLayerSwitcher() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [revision, forceRender] = useState();
  const layers = useSelector((state) => state.map.layers);

  // Force render when visibility changes
  useEffect(() => {
    const olKeys =
      layers?.map((layer) => {
        return layer?.on('change:visible', () => {
          forceRender(revision + 1);
        });
      }) || [];

    // Force render after first render because visibility of layers is  not yet applied.
    if (revision === undefined) {
      forceRender(0);
    }

    return () => {
      unByKey(olKeys);
    };
  }, [layers, revision]);

  const direktVbLayers = layers.filter((layer) => {
    return (
      layer.key === direktverbindungenDay.key ||
      layer.key === direktverbindungenNight.key
    );
  });

  return (
    <FormGroup data-testid="sts-validity-layerswitcher">
      {direktVbLayers.map((layer) => {
        return (
          <FormControlLabel
            label={layer.visible ? <b>{t(layer.name)}</b> : t(layer.name)}
            checked={layer.visible}
            control={
              <SBBSwitch
                key={layer.key}
                value={layer.key}
                onChange={() => {
                  layer.visible = !layer.visible;
                  dispatch(setFeatureInfo([]));
                }}
              />
            }
          />
        );
      })}
    </FormGroup>
  );
}

StsDirektverbindungenLayerSwitcher.propTypes = {};

export default StsDirektverbindungenLayerSwitcher;
