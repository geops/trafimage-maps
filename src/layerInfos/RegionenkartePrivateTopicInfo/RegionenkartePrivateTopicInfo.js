import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

const propTypes = {
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

const RegionenkartePrivateTopicInfo = ({ t }) => (
  <div>
    {t('ch.sbb.regionenkarte.intern-desc')}
    <p>
      {t('Verantwortlich')}:
      <br />
      I-VU-UEW, Anja Aebischer,
      <br />
      <a href={`mailto:${t('anja.aebischer@sbb.ch')}`}>
        {t('anja.aebischer@sbb.ch')}
      </a>
      .
    </p>
  </div>
);

RegionenkartePrivateTopicInfo.propTypes = propTypes;
RegionenkartePrivateTopicInfo.defaultProps = defaultProps;

export default withTranslation()(RegionenkartePrivateTopicInfo);
