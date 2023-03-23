/* eslint-disable no-param-reassign */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FormGroup, FormControlLabel, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { unByKey } from 'ol/Observable';
import SBBSwitch from '../../components/SBBSwitch';
import { IPV_KEY } from '../../utils/constants';

const ipvDayNightRegex = new RegExp(`^${IPV_KEY}.(day|night)$`);

const useStyles = makeStyles(() => {
  return {
    switchWrapper: {
      '& .MuiFormControlLabel-root': {
        minWidth: 140,
      },
      '& .MuiSwitch-switchBase': {
        top: (props) => (props.isMobile && props.row ? 4 : 0),
      },
    },
  };
});

function StsDirektverbindungenLayerSwitcher({ onToggle, row }) {
  const { t } = useTranslation();
  const [revision, forceRender] = useState();
  const layers = useSelector((state) => state.map.layers);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  const classes = useStyles({ isMobile, row });
  const ipvLayers = useMemo(
    () =>
      layers.filter((layer) => {
        return ipvDayNightRegex.test(layer.key);
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
          if (ipvDayNightRegex.test(targetLayer.key)) {
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

StsDirektverbindungenLayerSwitcher.propTypes = {
  onToggle: PropTypes.func,
  row: PropTypes.bool,
};

StsDirektverbindungenLayerSwitcher.defaultProps = {
  onToggle: () => {},
  row: false,
};

export default StsDirektverbindungenLayerSwitcher;
