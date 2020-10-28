import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  makeStyles,
} from '@material-ui/core';
import AusbauLayer from '../../layers/AusbauLayer';
import { updateConstructions } from '../../config/layers';

const useStyles = makeStyles(() => ({
  formControl: {
    marginTop: 10,
    marginBottom: 20,
  },

  selectIcon: {
    marginRight: -4,
  },
}));

const propTypes = {
  layer: PropTypes.instanceOf(AusbauLayer),
};

const defaultProps = {
  layer: null,
};

const FILTER_PROP = 'angebotsschritt';

const AusbauFilters = ({ layer }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  const onChange = useCallback(
    (evt) => {
      const newValue = evt.target.value;
      setValue(newValue);
      layer.applyNewFilter(['==', newValue, ['get', FILTER_PROP]]);
      updateConstructions(layer.mapboxLayer.mbMap);
    },
    [layer, setValue],
  );

  if (!layer || !layer.isShowFilter) {
    return null;
  }

  return (
    <>
      <FormControl fullWidth className={classes.formControl}>
        <InputLabel shrink>{t(FILTER_PROP)}</InputLabel>
        <Select
          autoWidth
          displayEmpty
          value={value}
          onChange={onChange}
          classes={{ icon: classes.selectIcon }}
        >
          <MenuItem value="">{t('Projekte im Bau')}</MenuItem>
          <MenuItem value="2030">{t('Fertigstellung bis 2030')}</MenuItem>
          <MenuItem value="2035">{t('Fertigstellung bis 2035')}</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

AusbauFilters.propTypes = propTypes;
AusbauFilters.defaultProps = defaultProps;

export default AusbauFilters;
