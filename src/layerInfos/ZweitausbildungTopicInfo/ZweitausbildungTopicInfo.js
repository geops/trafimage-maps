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
      <p>{t('ch.sbb.zweitausbildung-desc')}</p>
      <p>{t('Letzte Aktualisierung')}: 09/2022</p>
      <p>
        {t('Verantwortlich')}:
        <br />
        {t('HR-POK-SKK-PM (KBC und VSV)')},
        <br />
        <a href="mailto:pm.skk.kbc@sbb.ch">pm.skk.kbc@sbb.ch</a>.
      </p>
    </div>
  );
};

ZweitausbildungTopicInfo.propTypes = propTypes;

export default compose(withTranslation())(ZweitausbildungTopicInfo);
