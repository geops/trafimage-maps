import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';

const propTypes = {
  language: PropTypes.string.isRequired,
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const regions = {
  'Region West': {
    de: 'Region West',
    en: 'West Region',
    it: 'Regione Ovest',
    fr: 'Région Ouest',
  },
  'Region Mitte': {
    de: 'Region Mitte',
    en: 'Center Region',
    it: 'Regione Centro',
    fr: 'Région Centre',
  },
  'Region Süd': {
    de: 'Region Süd',
    en: 'South Region',
    it: 'Regione Sud',
    fr: 'Région Sud',
  },
  'Region Ost': {
    de: 'Region Ost',
    en: 'East Region',
    it: 'Regione Est',
    fr: 'Région Est',
  },
  'Andere ISB BLS': {
    de: 'Andere ISB BLS',
    en: 'Other ISB BLS',
    it: 'Altro ISB BLS',
    fr: 'Autre ISB BLS',
  },
  'Andere ISB SOB': {
    de: 'Andere ISB SOB',
    en: 'Other ISB SOB',
    it: 'Altro Est',
    fr: 'Autre ISB SOB',
  },
};

const BetriebsRegionenPopup = ({ language, feature }) => {
  const regionName = feature.get('region');
  if (!regions[regionName]) {
    return null;
  }
  return (
    <div>
      <span>{regions[regionName][language]}</span>
    </div>
  );
};

BetriebsRegionenPopup.propTypes = propTypes;
export default memo(BetriebsRegionenPopup);
