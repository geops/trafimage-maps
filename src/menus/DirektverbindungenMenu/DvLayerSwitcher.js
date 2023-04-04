/* eslint-disable no-param-reassign */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, FormControlLabel, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { unByKey } from 'ol/Observable';
import SBBSwitch from '../../components/SBBSwitch';
import { DV_DAY_NIGHT_REGEX } from '../../utils/constants';
import { setFeatureInfo } from '../../model/app/actions';

const useStyles = makeStyles(() => {
  return {
    switchWrapper: {
      '& .MuiFormControlLabel-label': {
        fontSize: 16,
      },
      '& .MuiFormControlLabel-root': {
        minWidth: 155,
      },
      '& .MuiSwitch-switchBase': {
        top: (props) => (props.isMobile && props.row ? 4 : 0),
      },
      '& .Mui-disabled': {
        '& .MuiSwitch-root': {
          opacity: 0.6,
        },
      },
    },
  };
});

function DvLayerSwitcher({ onToggle, row }) {
  const { t } = useTranslation();
  const [revision, forceRender] = useState();
  const dispatch = useDispatch();
  const layers = useSelector((state) => state.map.layers);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  const classes = useStyles({ isMobile, row });
  const dvLayers = useMemo(
    () =>
      layers.filter((layer) => {
        return DV_DAY_NIGHT_REGEX.test(layer.key);
      }),
    [layers],
  );
  const getVisibleLayerKeys = useCallback(
    () => dvLayers.filter((l) => l.visible).map((l) => l.key),
    [dvLayers],
  );
  const [layersVisible, setLayersVisible] = useState(getVisibleLayerKeys());

  // Force render when visibility changes
  useEffect(() => {
    const olKeys =
      layers?.map((layer) => {
        return layer?.on('change:visible', (evt) => {
          forceRender(revision + 1);
          const { target: targetLayer } = evt;
          if (DV_DAY_NIGHT_REGEX.test(targetLayer.key)) {
            setLayersVisible(getVisibleLayerKeys());
          }
        });
      }) || [];

    // Force render after first render because visibility of layers is  not yet applied.
    if (revision === undefined) {
      forceRender(0);
      setLayersVisible(getVisibleLayerKeys());
    }

    return () => {
      unByKey(olKeys);
    };
  }, [layers, revision, getVisibleLayerKeys]);

  useEffect(() => {
    // If the switcher configuration filters out all features from list
    // (e.g. when both layers are deactivated) we remove the featureInfo
    if (featureInfo.length) {
      if (
        !layersVisible?.length ||
        (layersVisible.length === 1 &&
          !featureInfo[0].features.some(
            (feat) => feat.get('line') === layersVisible[0].split('.').pop(),
          ))
      ) {
        dispatch(setFeatureInfo([]));
      }
    }
  }, [dispatch, featureInfo, layersVisible]);

  return (
    <FormGroup
      data-testid="dv-layerswitcher"
      row={row}
      className={classes.switchWrapper}
    >
      {dvLayers.map((layer) => {
        return (
          <FormControlLabel
            key={layer.key}
            label={t(layer.name)}
            checked={layersVisible.includes(layer.key)}
            control={
              <SBBSwitch
                key={layer.key}
                value={layer.key}
                disabled={layer.visible && layersVisible?.length === 1}
                data-testid={`dv-layerswitcher-${layer.key}`}
                onChange={() => {
                  layer.visible = !layer.visible;
                  onToggle(layer);
                }}
              />
            }
          />
        );
      })}
    </FormGroup>
  );
}

DvLayerSwitcher.propTypes = {
  onToggle: PropTypes.func,
  row: PropTypes.bool,
};

DvLayerSwitcher.defaultProps = {
  onToggle: () => {},
  row: false,
};

export default DvLayerSwitcher;
