import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ostImg from '../../img/layers/Betriebsregionen/ost.png';
import sudImg from '../../img/layers/Betriebsregionen/sud.png';
import westImg from '../../img/layers/Betriebsregionen/west.png';
import mitteImg from '../../img/layers/Betriebsregionen/mitte.png';
import otherImg from '../../img/layers/Betriebsregionen/other.png';

const propTypes = {
  t: PropTypes.func.isRequired,
};

const regions = [
  {
    title: 'West',
    img: westImg,
  },
  {
    title: 'Mitte',
    img: mitteImg,
  },
  {
    title: 'Süd',
    img: sudImg,
  },
  {
    title: 'Ost',
    img: ostImg,
  },
  {
    title: 'Andere Infrastrukturbetreiberinnen',
    img: otherImg,
  },
];

const BetriebsRegionenLayerInfo = ({ t }) => {
  return (
    <div>
      <span>{t('ch.sbb.betriebsregionen-desc')}</span>
      <div className="wkp-betriebsregionen">
        {regions.map((region) => (
          <div className="wkp-betriebsregion">
            <img src={region.img} height={25} width={25} alt={region.title} />
            {t(region.title)}
          </div>
        ))}
      </div>
    </div>
  );
};

BetriebsRegionenLayerInfo.propTypes = propTypes;
export default memo(withTranslation()(BetriebsRegionenLayerInfo));
