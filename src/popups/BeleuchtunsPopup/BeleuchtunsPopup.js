import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { lightMapping } from './lightMapping';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const BeleuchtunsPopup = ({ feature }) => {
  const { t } = useTranslation();
  const stationClass = feature.get('bahnhofKlasse');
  const info = lightMapping.find((item) => item.key === stationClass)?.info;

  return (
    <div>
      <span>{info && t(info[0])}</span>
      <span>{info && t(info[1])}</span>
    </div>
  );
};

BeleuchtunsPopup.propTypes = propTypes;
export default memo(BeleuchtunsPopup);
