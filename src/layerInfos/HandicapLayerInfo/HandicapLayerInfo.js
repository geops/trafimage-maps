import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import './HandicapLayerInfo.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  properties: PropTypes.object.isRequired,
  staticFilesUrl: PropTypes.string.isRequired,
};

const defaultProps = {};

const names = {
  barrierfree: 'ch.sbb.barrierfreierbahnhoefe',
  notBarrierfree: 'ch.sbb.nichtbarrierfreierbahnhoefe',
  stuetzpunkt: 'bahnhof_plural',
};

const HandicapLayerInfo = ({ t, properties, language, staticFilesUrl }) => {
  const handicapType = properties.get('handicapType');

  const name = t(names[handicapType]);
  const comps = {
    de: (
      <div>
        {name}, an denen beim SBB Call Center Handicap unter der Nummer{' '}
        <a href="tel:0800 007 102">0800 007 102</a> eine Hilfestellung bestellt
        werden kann.
      </div>
    ),
    fr: (
      <div>
        {name} pour lesquelles il est possible de commander un service
        d’assistance auprès du Call Center Handicap CFF au numéro{' '}
        <a href="tel:0800 007 102">0800 007 102</a>.
      </div>
    ),
    en: (
      <div>
        {name} where assistance can be requested from the SBB Call Center
        Handicap by calling <a href="tel:0800 007 102">0800 007 102</a>.
      </div>
    ),
    it: (
      <div>
        {name} in cui è possibile richiedere assistenza contattando il Call
        Center Handicap FFS al numero
        <a href="tel:0800 007 102">0800 007 102</a>.
      </div>
    ),
  };

  let image = <div className="stuetzpunkt-layer-icon" />;
  if (handicapType !== 'stuetzpunkt') {
    image = (
      <img
        src={`${staticFilesUrl}/img/layers/handicap/${
          handicapType === 'barrierfree'
            ? 'barrierfreierBahnhoefe'
            : 'nichtBarrierfreierBahnhoefe'
        }.png`}
        draggable="false"
        alt={t('Kein Bildtext')}
      />
    );
  }

  return (
    <div className="handicap-layer-info">
      {image}
      {comps[language]}
    </div>
  );
};

HandicapLayerInfo.propTypes = propTypes;
HandicapLayerInfo.defaultProps = defaultProps;

export default withTranslation()(HandicapLayerInfo);
