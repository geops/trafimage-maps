/* eslint-disable no-param-reassign */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, FormControlLabel, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { unByKey } from 'ol/Observable';
import SBBSwitch from '../../components/SBBSwitch';
import { IPV_DAY_NIGHT_REGEX } from '../../utils/constants';
import { setFeatureInfo } from '../../model/app/actions';

const useStyles = makeStyles(() => {
  return {
    switchWrapper: {
      '& .MuiFormControlLabel-label': {
        fontSize: 16,
      },
      '& .MuiFormControlLabel-root': {
        minWidth: 140,
      },
      '& .MuiSwitch-switchBase': {
        top: (props) => (props.isMobile && props.row ? 4 : 0),
      },
    },
  };
});

function IpvLayerSwitcher({ onToggle, row }) {
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
  const ipvLayers = useMemo(
    () =>
      layers.filter((layer) => {
        return IPV_DAY_NIGHT_REGEX.test(layer.key);
      }),
    [layers],
  );
  const getVisibleLayerKeys = useCallback(
    () => ipvLayers.filter((l) => l.visible).map((l) => l.key),
    [ipvLayers],
  );
  const [layersVisible, setLayersVisible] = useState(getVisibleLayerKeys());

  // Force render when visibility changes
  useEffect(() => {
    const olKeys =
      layers?.map((layer) => {
        return layer?.on('change:visible', (evt) => {
          forceRender(revision + 1);
          const { target: targetLayer } = evt;
          if (IPV_DAY_NIGHT_REGEX.test(targetLayer.key)) {
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
    // If featureInfos but both layers are deactivated we remove the featureInfos from store
    if (featureInfo.length && !layersVisible?.length) {
      dispatch(setFeatureInfo([]));
    }
  }, [dispatch, featureInfo, layersVisible]);

  return (
    <FormGroup
      data-testid="ipv-layerswitcher"
      row={row}
      className={classes.switchWrapper}
    >
      {ipvLayers.map((layer) => {
        return (
          <FormControlLabel
            key={layer.key}
            label={layer.visible ? <b>{t(layer.name)}</b> : t(layer.name)}
            checked={layersVisible.includes(layer.key)}
            control={
              <SBBSwitch
                key={layer.key}
                value={layer.key}
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

IpvLayerSwitcher.propTypes = {
  onToggle: PropTypes.func,
  row: PropTypes.bool,
};

IpvLayerSwitcher.defaultProps = {
  onToggle: () => {},
  row: false,
};

export default IpvLayerSwitcher;
