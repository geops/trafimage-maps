/* eslint-disable no-param-reassign */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FormGroup, FormControlLabel, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { unByKey } from 'ol/Observable';
import SBBSwitch from '../../components/SBBSwitch';
import { ipvDay, ipvNight } from '../../config/ch.sbb.ipv';
// import { setFeatureInfo } from '../../model/app/actions';

const useStyles = makeStyles(() => {
  return {
    layerSwitcher: {
      padding: '15px 10px',
    },
    switchWrapper: {
      padding: '0 10px',
      '& .MuiSwitch-switchBase': {
        top: 4,
      },
    },
  };
});

function IpvLayerSwitcher() {
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();
  const [revision, forceRender] = useState();
  const layers = useSelector((state) => state.map.layers);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
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

  const ipvLayers = layers.filter((layer) => {
    return layer.key === ipvDay.key || layer.key === ipvNight.key;
  });

  // if (ipvLayers[0].mapboxLayer?.mbMap) {
  //   console.log(
  //     ipvLayers[0].mapboxLayer?.mbMap.queryRenderedFeatures(undefined, {
  //       layers: ['dv_lines_day', 'dv_lines_night'], // replace this with the name of the layer
  //     }),
  //   );
  //   console.log(ipvLayers[0].mapboxLayer?.mbMap.style);
  // } else {
  //   console.log('doublewank');
  // }

  return (
    <div className={classes.layerSwitcher}>
      <FormGroup data-testid="ipv-layerswitcher" row={isMobile}>
        {ipvLayers.map((layer) => {
          return (
            <FormControlLabel
              key={layer.key}
              label={layer.visible ? <b>{t(layer.name)}</b> : t(layer.name)}
              checked={layer.visible}
              className={classes.switchWrapper}
              control={
                <SBBSwitch
                  key={layer.key}
                  value={layer.key}
                  onChange={() => {
                    layer.visible = !layer.visible;
                  }}
                />
              }
            />
          );
        })}
      </FormGroup>
    </div>
  );
}

IpvLayerSwitcher.propTypes = {};

export default IpvLayerSwitcher;
