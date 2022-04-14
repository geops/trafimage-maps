import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';

const propTypes = {
  t: PropTypes.func.isRequired,
};

const ZweitausbildungTopicInfo = ({ t }) => {
  return (
    <div>
      {t('ch.sbb.zweitausbildung-desc')}
      <p>
        {t('Verantwortlich')}:
        <br />
        {t('HR-BIL-SKK-PM (VM und VS)')},
        <br />
        <a href="mailto:pm.skk.kbc@sbb.ch">pm.skk.kbc@sbb.ch</a>.
      </p>
    </div>
  );
};

ZweitausbildungTopicInfo.propTypes = propTypes;

export default compose(withTranslation())(ZweitausbildungTopicInfo);
