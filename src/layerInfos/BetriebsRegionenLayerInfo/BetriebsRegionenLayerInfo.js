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
    fill: '#0079C7',
  },
  {
    title: 'Mitte',
    fill: '#6F2282',
  },
  {
    title: 'Süd',
    fill: '#C60018',
  },
  {
    title: 'Ost',
    fill: '#BDBDBD',
  },
  {
    title: 'Andere Infrastrukturbetreiberinnen',
    fill: '#2d327d',
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
