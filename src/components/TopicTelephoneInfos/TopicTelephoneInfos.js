import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function TopicTelephoneInfos() {
  const { t } = useTranslation();
  const activeTopic = useSelector((state) => state.app.activeTopic);

  const { name } = activeTopic;

  return (
    <div className="wkp-tel-infos" tabIndex={0} role="button">
      {t('telephone_information', {
        name: t(name),
      })}
    </div>
  );
}

export default TopicTelephoneInfos;
