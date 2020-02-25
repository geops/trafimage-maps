import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

const PassagierFrequenzenPopup = ({ feature, t }) => {
  const statisticDate = feature.get('passagier_freq_jahr');

  const dwv = feature
    .get('dwv')
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return (
    <div className="wkp-passagier-freq-popup">
      <div className="wkp-passagier-freq-popup-body">
        <span>{t('passagier_freq_jahr', { statisticDate })}</span>
        <span>{`${dwv} ${t('Ein- und Aussteigende')}`}</span>
      </div>
    </div>
  );
};

PassagierFrequenzenPopup.propTypes = propTypes;
PassagierFrequenzenPopup.defaultProps = defaultProps;

const composed = compose(withTranslation())(PassagierFrequenzenPopup);

composed.renderTitle = feat => feat.get('name');
export default composed;
