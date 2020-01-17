import React from 'react';
import UIHeader from '@geops/react-ui/components/Header';
import { ReactComponent as SBBLogo } from '../../img/sbb-logo.svg';

import './Header.scss';

const Header = () => (
  <UIHeader className="wkp-header">
    <div className="wkp-header-right">
      <a href={process.env.REACT_APP_LOGIN_URL}>Login</a>
      <SBBLogo focusable={false} />
    </div>
  </UIHeader>
);

export default Header;
