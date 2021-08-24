import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';

const propTypes = {
  t: PropTypes.func.isRequired,
};

const NetzentwicklungTopicInfo = ({ t }) => {
  return (
    <>
      {t('ch.sbb.netzentwicklung-desc')}
      <br />
      <br />
      {t('Verantwortlich')}: I-NAT-NET-UM, Christof Mahnig,{' '}
      <a href="mailto:christof.mahnig@sbb.ch">christof.mahnig@sbb.ch</a>
    </>
  );
};

NetzentwicklungTopicInfo.propTypes = propTypes;
export default compose(withTranslation())(NetzentwicklungTopicInfo);
