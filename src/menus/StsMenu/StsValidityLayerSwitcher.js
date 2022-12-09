import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormGroup, FormControlLabel } from '@material-ui/core';
import { unByKey } from 'ol/Observable';
import SBBSwitch from '../../components/SBBSwitch/SBBSwitch';
import { highlights, gttos, premium } from '../../config/ch.sbb.sts';
import { setFeatureInfo } from '../../model/app/actions';

function StsValidityLayerSwitcher() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
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

  const stsLayers = useMemo(() => {
    return layers?.filter(
      (layer) =>
        layer.get('group') === (gttos.get('group') || premium.get('group')) ||
        layer.key === highlights.key,
    );
  }, [layers]);

  return (
    <FormGroup data-testid="sts-validity-layerswitcher">
      {stsLayers.map((layer) => {
        return (
          <FormControlLabel
            key={layer.key}
            label={layer.visible ? <b>{t(layer.name)}</b> : t(layer.name)}
            checked={layer.visible}
            control={
              <SBBSwitch
                key={layer.key}
                value={layer.key}
                onChange={() => {
                  // eslint-disable-next-line no-param-reassign
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

StsValidityLayerSwitcher.propTypes = {};

export default StsValidityLayerSwitcher;
