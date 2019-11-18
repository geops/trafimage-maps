import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const TopicTelephoneInfos = () => {
  const { t } = useTranslation();
  const activeTopic = useSelector(state => state.app.activeTopic);

  const { name, telephone } = activeTopic;

  return telephone ? (
    <div className="wkp-tel-infos">
      {t('telephone_information', {
        name: t(name),
        telephone,
      })}
    </div>
  ) : null;
};

export default TopicTelephoneInfos;
