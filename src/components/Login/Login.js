import React, { useMemo } from 'react';
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

  return (
    <div className="wkp-login">
      <a href={`${appBaseUrl}/login?next=${window.location.href}`}>
        <AiOutlineUser className="wkp-login-icon" />
        <span className="wkp-login-text">{login}</span>
      </a>
    </div>
  );
};

Login.propTypes = {
  appBaseUrl: PropTypes.string.isRequired,
};

export default React.memo(Login);
