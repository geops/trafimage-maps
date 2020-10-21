import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import Layer from 'mobility-toolbox-js/common/layers/Layer';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  makeStyles,
} from '@material-ui/core';
import { updateConstructions } from '../../config/layers';

const useStyles = makeStyles(() => ({
  formControl: {
    marginTop: 10,
    marginBottom: 20,
  },
}));

const propTypes = {
  layer: PropTypes.instanceOf(Layer),
};

const defaultProps = {
  layer: null,
};

const FILTER_PROP = 'angebotsschritt';
const DATA_LAYER_PROP = 'dataLayer';
const initialFiltersById = {};

const onChange = (value, layers) => {
  layers.forEach(({ mbMap }) => {
    const style = mbMap.getStyle();
    if (!mbMap || !style) {
      return;
    }

    style.layers.forEach(({ id }) => {
      // console.log(id, mbMap.getFilter(id));

      // This filter must affect nur Ausbau layers.
      if (!/ausbau/.test(id)) {
        return;
      }

      // Store the initial filter values for each style layer.
      if (!initialFiltersById[id]) {
        initialFiltersById[id] = mbMap.getFilter(id) || [];
      }

      let newFilter = initialFiltersById[id].length
        ? [...initialFiltersById[id]]
        : null;

      const filterToApply = ['==', value, ['get', FILTER_PROP]];

      if (value !== undefined) {
        if (!newFilter) {
          newFilter = ['all', filterToApply];
        } else if (newFilter[0] === 'all') {
          // we assume the filter is define with 'all' keyword
          // ['all', filter1, filter2]
          newFilter.push(filterToApply);
        }
      }
      mbMap.setFilter(id, newFilter);
    });
    updateConstructions(mbMap);
  });
};

const AusbauFilters = ({ layer }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const isShowFilter = qs.parse(window.location.search).showFilter === 'true';

  const updateFilter = useCallback(
    (evt) => {
      const newValue = evt.target.value;
      setValue(newValue);
      onChange(newValue, [layer.get(DATA_LAYER_PROP)]);
    },
    [layer, setValue],
  );

  if (!isShowFilter || !layer || !layer.get(DATA_LAYER_PROP)) {
    return null;
  }

  return (
    <>
      <FormControl fullWidth className={classes.formControl}>
        <InputLabel shrink>{t(FILTER_PROP)}</InputLabel>
        <Select autoWidth displayEmpty value={value} onChange={updateFilter}>
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

export default React.memo(AusbauFilters);
