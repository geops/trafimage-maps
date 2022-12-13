import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';

const propTypes = {
  t: PropTypes.func.isRequired,
};

function NetzentwicklungTopicInfo({ t }) {
  return (
    <div>
      <p>{t('ch.sbb.netzentwicklung-desc')}</p>
      {t('Verantwortlich')}: I-NAT-NET-UM, Christof Mahnig,{' '}
      <a href="mailto:christof.mahnig@sbb.ch">christof.mahnig@sbb.ch</a>
    </div>
  );
}

NetzentwicklungTopicInfo.propTypes = propTypes;
export default compose(withTranslation())(NetzentwicklungTopicInfo);
