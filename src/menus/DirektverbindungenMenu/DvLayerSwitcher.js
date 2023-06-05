/* eslint-disable no-param-reassign */
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, FormControlLabel, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { unByKey } from 'ol/Observable';
import SBBSwitch from '../../components/SBBSwitch';
import { DV_DAY_NIGHT_REGEX } from '../../utils/constants';
import { setFeatureInfo } from '../../model/app/actions';
import DvLegendLine from '../../config/ch.sbb.direktverbindungen/DvLegendLine/DvLegendLine';

const useStyles = makeStyles(() => {
  return {
    switchWrapper: {
      '& label:first-child': {
        marginRight: 20,
      },
      '& .MuiFormControlLabel-label': {
        fontSize: 16,
      },
      '& .MuiFormControlLabel-root': {
        minWidth: 155,
      },
      '& .MuiSwitch-switchBase': {
        top: (props) => (props.isMobile && props.row ? 4 : 0),
      },
    },
    disabled: {
      cursor: 'not-allowed',
      '& .MuiButtonBase-root': {
        cursor: 'not-allowed',
      },
      '& .MuiSwitch-root': {
        opacity: 0.6,
      },
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      '& span': {
        minWidth: 80,
      },
    },
  };
});

function DvSwitcherLabel({ title, color }) {
  const classes = useStyles({ color });
  return (
    <span className={classes.label}>
      <span>{title}</span>
      <DvLegendLine color={color} />
    </span>
  );
}

DvSwitcherLabel.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

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
  const layersVisible = dvLayers.filter((l) => l.visible).map((l) => l.key);

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
        const disabled = layer.visible && layersVisible?.length === 1;
        return (
          <FormControlLabel
            className={disabled ? classes.disabled : undefined}
            key={layer.key}
            label={
              <DvSwitcherLabel
                title={t(layer.name)}
                color={layer.get('color')}
              />
            }
            checked={layersVisible.includes(layer.key)}
            control={
              <SBBSwitch
                key={layer.key}
                value={layer.key}
                data-testid={`dv-layerswitcher-${layer.key}`}
                onChange={() => {
                  if (disabled) return;
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
