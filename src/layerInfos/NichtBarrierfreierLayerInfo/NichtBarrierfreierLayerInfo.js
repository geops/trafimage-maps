import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

import './NichtBarrierfreierLayerInfo.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};

const defaultProps = {};

const desc = {
  de: (
    <div>
      Nicht barrierefreier Bahnhof an dem beim SBB Call Center Handicap unter
      der Nummer <a href="tel:0800 007 102">0800 007 102</a> eine Hilfestellung
      bestellt werden kann.
    </div>
  ),
  fr: (
    <div>
      Nicht barrierefreier Bahnhof an dem beim SBB Call Center Handicap unter
      der Nummer <a href="tel:0800 007 102">0800 007 102</a> eine Hilfestellung
      bestellt werden kann.
    </div>
  ),
  en: (
    <div>
      Nicht barrierefreier Bahnhof an dem beim SBB Call Center Handicap unter
      der Nummer <a href="tel:0800 007 102">0800 007 102</a> eine Hilfestellung
      bestellt werden kann.
    </div>
  ),
  it: (
    <div>
      Nicht barrierefreier Bahnhof an dem beim SBB Call Center Handicap unter
      der Nummer <a href="tel:0800 007 102">0800 007 102</a> eine Hilfestellung
      bestellt werden kann.
    </div>
  ),
};

const NichtBarrierfreierLayerInfo = ({ t, language }) => {
  return (
    <div className="nicht-barrierfreier-layer-info">
      <img
        src={`${process.env.REACT_APP_STATIC_FILES_URL}/img/layers/handicap/nichtBarrierfreierBahnhoefe.png`}
        draggable="false"
        alt={t('Kein Bildtext')}
      />
      {desc[language]}
    </div>
  );
};

NichtBarrierfreierLayerInfo.propTypes = propTypes;
NichtBarrierfreierLayerInfo.defaultProps = defaultProps;

export default compose(withTranslation())(NichtBarrierfreierLayerInfo);
