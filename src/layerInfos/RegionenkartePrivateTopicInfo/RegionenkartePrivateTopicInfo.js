import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

const propTypes = {
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

const RegionenkartePrivateTopicInfo = ({ t }) => {
  return (
    <div>
      {t('ch.sbb.regionenkarte.intern-desc')}
      <p>
        {t('Verantwortlich')}:
        <br />
        I-AT-UEW, Aurelia Kollros,
        <br />
        <a href={`mailto:${t('aurelia.kollros@sbb.ch')}`}>
          {t('aurelia.kollros@sbb.ch')}
        </a>
        .
      </p>
    </div>
  );
};

RegionenkartePrivateTopicInfo.propTypes = propTypes;
RegionenkartePrivateTopicInfo.defaultProps = defaultProps;

export default compose(withTranslation())(RegionenkartePrivateTopicInfo);
