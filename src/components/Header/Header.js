import React from 'react';
import UIHeader from '@geops/react-ui/components/Header';
import SBBLogo from '../../img/sbb-logo.png';

import './Header.scss';

const Header = () => (
  <UIHeader className="wkp-header">
    <div className="wkp-header-right">
      <img src={SBBLogo} alt="SBB Logo" />
    </div>
  </UIHeader>
);

export default Header;
