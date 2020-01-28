import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import './HandicapLayerInfo.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  properties: PropTypes.object.isRequired,
};

const defaultProps = {};

const names = {
  barrierfree: 'Barrierefreie Bahnhöfe',
  notBarrierfree: 'Nicht barrierefreie Bahnhöfe',
  stuetzpunkt: 'bahnhof_plural',
};

const desc = (name, lng) => {
  if (lng === 'de') {
    return (
      <div>
        {name}, an denen beim SBB Call Center Handicap unter der Nummer{' '}
        <a href="tel:0800 007 102">0800 007 102</a> eine Hilfestellung bestellt
        werden kann.
      </div>
    );
  }
  if (lng === 'fr') {
    return (
      <div>
        {name} pour lesquelles il est possible de commander un service
        d’assistance auprès du Call Center Handicap CFF au numéro{' '}
        <a href="tel:0800 007 102">0800 007 102</a>.
      </div>
    );
  }
  if (lng === 'en') {
    return (
      <div>
        {name} where assistance can be requested from the SBB Call Center
        Handicap by calling <a href="tel:0800 007 102">0800 007 102</a>.
      </div>
    );
  }
  return (
    <div>
      {name} in cui è possibile richiedere assistenza contattando il Call Center
      Handicap FFS al numero <a href="tel:0800 007 102">0800 007 102</a>.
    </div>
  );
};

const HandicapLayerInfo = ({ t, properties, language }) => {
  const handicapType = properties.get('handicapType');

  let image = <div className="stuetzpunkt-layer-icon" />;
  if (handicapType !== 'stuetzpunkt') {
    image = (
      <img
        src={`${process.env.REACT_APP_STATIC_FILES_URL}/img/layers/handicap/${
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
      {desc(t(names[handicapType]), language)}
    </div>
  );
};

HandicapLayerInfo.propTypes = propTypes;
HandicapLayerInfo.defaultProps = defaultProps;

export default withTranslation()(HandicapLayerInfo);
