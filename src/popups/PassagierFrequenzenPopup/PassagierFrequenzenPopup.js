import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

function PassagierFrequenzenPopup({ feature, t }) {
  const language = useSelector((state) => state.app.language);

  const statisticDate = feature.get('passagier_freq_jahr');
  const dwv = feature
    .get('dwv')
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009');
  const remark = feature.get(`passagier_freq_bemerkungen_${language}`);

  return (
    <div className="wkp-passagier-freq-popup">
      <div className="wkp-passagier-freq-popup-body">
        <span>{t('passagier_freq_jahr', { statisticDate })}</span>
        <span>{`${dwv} ${t('Ein- und Aussteigende')}`}</span>
        {remark ? (
          <span className="wkp-passagier-freq-remark">{remark}</span>
        ) : null}
      </div>
    </div>
  );
}

PassagierFrequenzenPopup.propTypes = propTypes;
PassagierFrequenzenPopup.defaultProps = defaultProps;

const composed = withTranslation()(PassagierFrequenzenPopup);

composed.renderTitle = (feat) => feat.get('name');
export default composed;
