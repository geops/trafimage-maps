import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { AiOutlineUser } from 'react-icons/ai';

import './Login.scss';

const Login = ({ appBaseUrl }) => {
  const permissionsInfos = useSelector(state => state.app.permissionsInfos);

  const login = useMemo(() => {
    if (permissionsInfos && permissionsInfos.user) {
      return permissionsInfos.user;
    }
    return 'Login';
  }, [permissionsInfos]);

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
      onKeyPress={evt => evt.which === 13 && openLoginPage()}
      tabIndex={0}
    >
      <AiOutlineUser className="wkp-login-icon" />
      <span className="wkp-login-text">{login}</span>
    </div>
  );
};

Login.propTypes = {
  appBaseUrl: PropTypes.string.isRequired,
};

export default React.memo(Login);
