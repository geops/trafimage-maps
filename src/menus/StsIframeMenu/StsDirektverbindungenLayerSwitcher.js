/* eslint-disable no-param-reassign */
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormGroup, FormControlLabel } from '@material-ui/core';
import SBBSwitch from '../../components/SBBSwitch/SBBSwitch';
import {
  direktverbindungenDay,
  direktverbindungenNight,
} from '../../config/ch.sbb.sts.iframe';
import { setFeatureInfo } from '../../model/app/actions';

const getVisibleLayers = () => {
  return [direktverbindungenDay, direktverbindungenNight].reduce(
    (visible, layer) => (layer.visible ? [...visible, layer.key] : visible),
    [],
  );
};

function StsDirektverbindungenLayerSwitcher() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [visibleLayers, setVisibleLayers] = useState(getVisibleLayers());

  const dvDayVisible = visibleLayers?.includes(direktverbindungenDay.key);
  const dvNightVisible = visibleLayers?.includes(direktverbindungenNight.key);

  const onSwitchClick = useCallback(
    (evt, layer) => {
      layer.visible = evt.target.checked;
      setVisibleLayers(getVisibleLayers());
      dispatch(setFeatureInfo([]));
    },
    [dispatch],
  );

  return (
    <>
      <FormGroup>
        <FormControlLabel
          label={
            dvDayVisible ? (
              <b>{t(direktverbindungenDay.name)}</b>
            ) : (
              t(direktverbindungenDay.name)
            )
          }
          checked={dvDayVisible}
          control={
            <SBBSwitch
              key={direktverbindungenDay.key}
              value={direktverbindungenDay.key}
              onChange={(evt) => onSwitchClick(evt, direktverbindungenDay)}
            />
          }
        />
        <FormControlLabel
          label={
            dvNightVisible ? (
              <b>{t(direktverbindungenNight.name)}</b>
            ) : (
              t(direktverbindungenNight.name)
            )
          }
          checked={dvNightVisible}
          control={
            <SBBSwitch
              key={direktverbindungenNight.key}
              value={direktverbindungenNight.key}
              onChange={(evt) => onSwitchClick(evt, direktverbindungenNight)}
            />
          }
        />
      </FormGroup>
    </>
  );
}

StsDirektverbindungenLayerSwitcher.propTypes = {};

export default StsDirektverbindungenLayerSwitcher;
