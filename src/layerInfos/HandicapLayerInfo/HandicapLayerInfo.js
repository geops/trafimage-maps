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

const descriptions = {
  de: {
    barrierfree: ' an denen autonomes Reisen möglich ist.',
    notBarrierfree: ' an denen automes Reisen nicht möglich ist.',
    stuetzpunkt: (
      <>
        , an denen beim SBB Call Center Handicap unter der Nummer{' '}
        <a href="tel:0800 007 102">0800 007 102</a> eine Hilfestellung bestellt
        werden kann.
      </>
    ),
  },
  en: {
    barrierfree: ' where autonomous travel is possible.',
    notBarrierfree: ' where autonomous travel is not possible.',
    stuetzpunkt: (
      <>
        {' '}
        where assistance can be requested from the SBB Call Center Handicap by
        calling <a href="tel:0800 007 102">0800 007 102</a>.
      </>
    ),
  },
  fr: {
    barrierfree:
      ' dans lesquelles il est possible de se déplacer en toute autonomie.',
    notBarrierfree:
      ' dans lesquelles il est impossible de se déplacer en toute autonomie.',
    stuetzpunkt: (
      <>
        {' '}
        pour lesquelles il est possible de commander un service d’assistance
        auprès du Call Center Handicap CFF au numéro{' '}
        <a href="tel:0800 007 102">0800 007 102</a>.
      </>
    ),
  },
  it: {
    barrierfree: ' in cui è possibile viaggiare in autonomia.',
    notBarrierfree: ' in cui non è possibile viaggiare in autonomia.',
    stuetzpunkt: (
      <>
        {' '}
        in cui è possibile richiedere assistenza contattando il Call Center
        Handicap FFS al numero <a href="tel:0800 007 102">0800 007 102</a>.
      </>
    ),
  },
};

const HandicapLayerInfo = ({ t, properties, language, staticFilesUrl }) => {
  const handicapType = properties.get('handicapType');

  const name = t(names[handicapType]);
  const description = descriptions[language][handicapType];

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
      <div>
        {name}
        {description}
      </div>
    </div>
  );
};

HandicapLayerInfo.propTypes = propTypes;
HandicapLayerInfo.defaultProps = defaultProps;

export default withTranslation()(HandicapLayerInfo);
