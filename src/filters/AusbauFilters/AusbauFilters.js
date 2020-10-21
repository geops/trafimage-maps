import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import Layer from 'mobility-toolbox-js/common/layers/Layer';
import SelectFilter from '../SelectFilter';

const propTypes = {
  layer: PropTypes.instanceOf(Layer),
};

const defaultProps = {
  layer: null,
};

const FILTER_PROP = 'angebotsschritt';
const DATA_LAYER_PROP = 'dataLayer';
const initialFiltersById = {};

const onChange = (values, layers) => {
  layers.forEach(({ mbMap }) => {
    const style = mbMap.getStyle();
    if (!mbMap || !style) {
      return;
    }

    style.layers.forEach(({ id }) => {
      // console.log(id, mbMap.getFilter(id));

      // Store the initial filter values for each style layer.
      if (!initialFiltersById[id]) {
        initialFiltersById[id] = mbMap.getFilter(id) || [];
      }

      let newFilter = initialFiltersById[id].length
        ? [...initialFiltersById[id]]
        : null;
      // console.log('init filter:', newFilter);

      // We create an 'any' filter with all the choices selected.
      const filterToApply = ['any'];

      values.forEach((value) => {
        if (value !== undefined) {
          const filter = ['==', '', ['get', FILTER_PROP]];
          filterToApply.push(filter);
        }
      });

      // If some choices are selected we apply the 'any' filter
      // or we push it to the inital 'all' style layer filter.
      if (values.length) {
        if (!newFilter) {
          newFilter = filterToApply;
        } else if (newFilter[0] === 'all') {
          // we assume the filter is define with 'all' keyword
          // ['all', filter1, filter2]
          newFilter.push(filterToApply);
        }
      }
      // console.log(newFilter);
      mbMap.setFilter(id, newFilter);
    });
  });
};

const AusbauFilters = ({ layer }) => {
  const { t } = useTranslation();
  const isShowFilter = qs.parse(window.location.search).showFilter === 'true';

  if (!isShowFilter || !layer || !layer.get(DATA_LAYER_PROP)) {
    return null;
  }
  const dataLayer = layer.get(DATA_LAYER_PROP);

  return (
    <SelectFilter
      multiple
      label={t(FILTER_PROP)}
      choices={[
        { value: '', label: 'Projekte im Bau' },
        {
          value: '2030',
          label: 'Fertigstellung bis 2030 ',
        },
        { value: '2035', label: 'Fertigstellung bis 2035 ' },
      ]}
      onChange={(values) => {
        // console.log(values);
        onChange(values, [dataLayer]);
      }}
    />
  );
};

AusbauFilters.propTypes = propTypes;
AusbauFilters.defaultProps = defaultProps;

export default React.memo(AusbauFilters);
