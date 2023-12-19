/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FormGroup, FormControlLabel } from "@mui/material";
import { unByKey } from "ol/Observable";
import SBBSwitch from "../../components/SBBSwitch";
// import { highlights, gttos, premium } from '../../config/ch.sbb.sts';
import { STS_KEY } from "../../utils/constants";
import { setFeatureInfo } from "../../model/app/actions";

const stsStyleLayerRegex = new RegExp(
  `^${STS_KEY}.validity.(highlights|premium|gttos)$`,
);
const stsHightlightLayerRegex = new RegExp(`^${STS_KEY}.validity.highlights$`);
function StsValidityLayerSwitcher() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [revision, forceRender] = useState();
  const layers = useSelector((state) => state.map.layers);
  const stsLayers = useMemo(() => {
    return layers?.filter((layer) => stsStyleLayerRegex.test(layer.key));
  }, [layers]);
  const layersVisible = stsLayers.filter((l) => l.visible).map((l) => l.key);

  // Force render when visibility changes
  useEffect(() => {
    const olKeys =
      layers?.map((layer) => {
        return layer?.on("change:visible", () => {
          forceRender((value) => value + 1);
        });
      }) || [];

    // Force render after first render because visibility of layers is  not yet applied.
    if (revision === undefined) {
      forceRender(0);
    }

    return () => {
      unByKey(olKeys);
    };
  }, [layers, revision, stsLayers]);

  const onChange = useCallback(
    (layer) => {
      dispatch(setFeatureInfo([]));
      if (stsHightlightLayerRegex.test(layer.key)) {
        layer.visible = !layer.visible;
        return;
      }
      if (layer.visible) {
        layer.visible = false;
        return;
      }
      const otherGroupLayer = stsLayers.find(
        (lyr) => lyr.get("group") && lyr.key !== layer.key,
      );
      otherGroupLayer.visible = false;
      layer.visible = true;
    },
    [dispatch, stsLayers],
  );

  return (
    <FormGroup data-testid="sts-validity-layerswitcher">
      {stsLayers.map((layer) => {
        return (
          <FormControlLabel
            key={layer.key}
            label={layer.visible ? <b>{t(layer.name)}</b> : t(layer.name)}
            checked={layersVisible.includes(layer.key)}
            control={
              <SBBSwitch
                key={layer.key}
                value={layer.key}
                onChange={() => onChange(layer)}
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
