import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

const propTypes = {
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

const InterventionTopicInfo = ({ t }) => {
  return (
    <div>
      {t('ch.sbb.intervention-desc')}
      <p>
        {t('Verantwortlich')}:
        <br />
        I-B-OCI-TLZ,&nbsp;
        <a href={`mailto:${t('alsi@sbb.ch')}`}>{t('alsi@sbb.ch')}</a>.
      </p>
    </div>
  );
};

InterventionTopicInfo.propTypes = propTypes;
InterventionTopicInfo.defaultProps = defaultProps;

export default compose(withTranslation())(InterventionTopicInfo);
