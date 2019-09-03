import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

import './PassagierFrequenzenPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

const PassagierFrequenzenPopup = ({ feature, t }) => {
  const name = feature.get('name');
  const statisticDate = feature.get('passagier_freq_jahr');
  const dwv = feature.get('dwv');

  return (
    <div className="wkp-passagier-freq-popup">
      <div className="wkp-passagier-freq-popup-title">{name}</div>
      <div className="wkp-passagier-freq-popup-body">
        <span>{t('passagier_freq_jahr', { statisticDate })}</span>
        <span>{`${dwv} ${t('Ein- und Aussteiger')}`}</span>
      </div>
    </div>
  );
};

PassagierFrequenzenPopup.propTypes = propTypes;
PassagierFrequenzenPopup.defaultProps = defaultProps;

export default compose(withTranslation())(PassagierFrequenzenPopup);
