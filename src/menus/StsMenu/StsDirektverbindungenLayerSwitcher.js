/* eslint-disable no-param-reassign */
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormGroup, FormControlLabel } from '@material-ui/core';
import SBBSwitch from '../../components/SBBSwitch/SBBSwitch';
import {
  direktverbindungenDay,
  direktverbindungenNight,
} from '../../config/ch.sbb.sts';
import { setFeatureInfo } from '../../model/app/actions';

const getVisibleLayers = () => {
  return [direktverbindungenDay, direktverbindungenNight].reduce(
    (visible, layer) => (layer.visible ? [...visible, layer.key] : visible),
    [],
  );
};

function StsDirektverbindungenLayerSwitcher() {
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
    <FormGroup data-testid="sts-validity-layerswitcher">
      <FormControlLabel
        label={dvDayVisible ? <b>Day trains</b> : 'Day trains'}
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
        label={dvNightVisible ? <b>Night trains</b> : 'Night trains'}
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
  );
}

StsDirektverbindungenLayerSwitcher.propTypes = {};

export default StsDirektverbindungenLayerSwitcher;
