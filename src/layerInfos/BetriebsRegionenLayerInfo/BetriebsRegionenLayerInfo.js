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
    fill: '#ff0000',
  },
  {
    title: 'Mitte',
    fill: '#FCBB00',
  },
  {
    title: 'Süd',
    fill: '#F27E00',
  },
  {
    title: 'Ost',
    fill: '#00973B',
  },
  {
    title: 'Andere Infrastrukturbetreiberinnen',
    fill: '#BDBDBD',
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
