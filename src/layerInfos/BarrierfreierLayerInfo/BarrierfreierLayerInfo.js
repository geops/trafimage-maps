import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

import './BarrierfreierLayerInfo.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};

const defaultProps = {};

const desc = {
  de: (
    <div>
      Barrierefreier Bahnhof an dem beim SBB Call Center Handicap unter der
      Nummer <a href="tel:0800 007 102">0800 007 102</a> eine Hilfestellung
      bestellt werden kann.
    </div>
  ),
  fr: (
    <div>
      Barrierefreier Bahnhof an dem beim SBB Call Center Handicap unter der
      Nummer <a href="tel:0800 007 102">0800 007 102</a> eine Hilfestellung
      bestellt werden kann.
    </div>
  ),
  en: (
    <div>
      Barrierefreier Bahnhof an dem beim SBB Call Center Handicap unter der
      Nummer <a href="tel:0800 007 102">0800 007 102</a> eine Hilfestellung
      bestellt werden kann.
    </div>
  ),
  it: (
    <div>
      Barrierefreier Bahnhof an dem beim SBB Call Center Handicap unter der
      Nummer <a href="tel:0800 007 102">0800 007 102</a> eine Hilfestellung
      bestellt werden kann.
    </div>
  ),
};

const BarrierfreierLayerInfo = ({ t, language }) => {
  return (
    <div className="barrierfreier-layer-info">
      <img
        src={`${process.env.REACT_APP_STATIC_FILES_URL}/img/layers/handicap/barrierfreierBahnhoefe.png`}
        draggable="false"
        alt={t('Kein Bildtext')}
      />
      {desc[language]}
    </div>
  );
};

BarrierfreierLayerInfo.propTypes = propTypes;
BarrierfreierLayerInfo.defaultProps = defaultProps;

export default compose(withTranslation())(BarrierfreierLayerInfo);
