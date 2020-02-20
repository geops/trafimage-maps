import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

const propTypes = {
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

const NetzkarteTopicInfo = ({ t }) => {
  return (
    <div>
      {`${t('ch.sbb.netzkarte-desc')} ${t('ch.sbb.netzkarte-desc-topic-info')}`}
      <p>
        {t('Verantwortlich')}:
        <br />
        {t('SBB AG, Product Owner Trafimage')},
        <br />
        Daniel Hofstetter,&nbsp;
        <a href={`mailto:${t('trafimage@sbb.ch')}`}>{t('trafimage@sbb.ch')}</a>.
      </p>
    </div>
  );
};

NetzkarteTopicInfo.propTypes = propTypes;
NetzkarteTopicInfo.defaultProps = defaultProps;

export default withTranslation()(NetzkarteTopicInfo);
