import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { AiOutlineUser } from 'react-icons/ai';
import UIHeader from '@geops/react-ui/components/Header';
import { ReactComponent as SBBLogo } from '../../img/sbb-logo.svg';

import './Header.scss';

const propTypes = {
  appBaseUrl: PropTypes.string.isRequired,
};

const Header = ({ appBaseUrl }) => {
  let login = <a href={`${appBaseUrl}/login`}>Login</a>;
  const permissions = useSelector(state => state.app.permissions);

  if (permissions.user) {
    login = permissions.user;
  }

  return (
    <UIHeader className="wkp-header">
      <div className="wkp-header-right">
        <div className="wkp-header-login">
          <AiOutlineUser className="wkp-header-login-icon" />
          <span className="wkp-header-login-text">{login}</span>
        </div>
        <SBBLogo focusable={false} />
      </div>
    </UIHeader>
  );
};

Header.propTypes = propTypes;

export default Header;
