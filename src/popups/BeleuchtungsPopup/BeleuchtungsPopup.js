import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const BeleuchtungsPopup = ({ feature }) => {
  const { t } = useTranslation();
  const stationClass = feature.get('rte_klasse');

  return (
    <div>
      <p>{`${t('Beleuchtungsstärke')}: ${stationClass}`}</p>
      <p>{t('Bahnhofklasse gemäss VöV RTE 26201')}</p>
    </div>
  );
};

BeleuchtungsPopup.propTypes = propTypes;
const memoized = memo(BeleuchtungsPopup);
memoized.renderTitle = (feat) => feat.get('name');
export default memoized;
