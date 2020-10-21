import React from 'react';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import SelectFilter from '../SelectFilter';

const propTypes = {};

const defaultProps = {};

const AusbauFilters = () => {
  const { t } = useTranslation();
  const isShowFilter = qs.parse(window.location.search).showFilter === 'true';

  if (!isShowFilter) {
    return null;
  }

  return (
    <SelectFilter
      multiple
      label={t('Angebotsschritte 2035')}
      choices={[
        { value: 'Projekte im Bau', label: 'Projekte im Bau' },
        {
          value: 'Fertigstellung bis 2030 ',
          label: 'Fertigstellung bis 2030 ',
        },
        { value: 'Fertigstellung bis 2035', label: 'Fertigstellung bis 2035 ' },
      ]}
      onChange={() => {
        // onChange(val, 'region');
        // setRegionFilters(val);
      }}
    />
  );
};

AusbauFilters.propTypes = propTypes;
AusbauFilters.defaultProps = defaultProps;

export default React.memo(AusbauFilters);
