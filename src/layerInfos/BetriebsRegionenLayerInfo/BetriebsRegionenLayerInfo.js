import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Square from './Square';

const propTypes = {
  t: PropTypes.func.isRequired,
};

const regions = [
  {
    title: 'West',
    fill: '#1E90FF',
  },
  {
    title: 'Mitte',
    fill: '#FF00FF',
  },
  {
    title: 'Süd',
    fill: '#FF0000',
  },
  {
    title: 'Ost',
    fill: '#808080',
  },
  {
    title: 'Andere Infrastrukturbetreiberinnen',
    fill: '#000000',
  },
];

const BetriebsRegionenLayerInfo = ({ t }) => {
  return (
    <div>
      <span>{t('ch.sbb.betriebsregionen-desc')}</span>
      <div className="wkp-betriebsregionen">
        {regions.map((region) => (
          <div className="wkp-betriebsregion">
            <Square fill={region.fill} />
            {t(region.title)}
          </div>
        ))}
      </div>
    </div>
  );
};

BetriebsRegionenLayerInfo.propTypes = propTypes;
export default memo(withTranslation()(BetriebsRegionenLayerInfo));
