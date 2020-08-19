import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ReactComponent as SBBUser } from '../../img/sbb/user_92_large.svg';

import './Login.scss';

const Login = ({ appBaseUrl }) => {
  const { t } = useTranslation();
  const language = useSelector((state) => state.app.language);
  const permissionsInfos = useSelector((state) => state.app.permissionsInfos);

  const login = useMemo(() => {
    if (permissionsInfos && permissionsInfos.user) {
      return permissionsInfos.user;
    }
    return t('Anmelden');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionsInfos, language]);

  const openLoginPage = useCallback(() => {
    window.location.href = `${appBaseUrl}/login?next=${encodeURIComponent(
      window.location.href,
    )}`;
  }, [appBaseUrl]);

  return (
    <div
      className="wkp-login"
      role="button"
      onClick={openLoginPage}
      onKeyPress={(evt) => evt.which === 13 && openLoginPage()}
      tabIndex={0}
      title={permissionsInfos && permissionsInfos.user}
    >
      <SBBUser focusable={false} className="wkp-login-icon" />
      <span className="wkp-login-text">{login}</span>
    </div>
  );
};

Login.propTypes = {
  appBaseUrl: PropTypes.string.isRequired,
};

export default React.memo(Login);
