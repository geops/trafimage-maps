import React from 'react';
import UIHeader from '@geops/react-ui/components/Header';
import { ReactComponent as SBBLogo } from '../../img/sbb-logo.svg';

import './Header.scss';

const Header = () => (
  <UIHeader className="wkp-header">
    <div className="wkp-header-right">
      <SBBLogo focusable={false} />
    </div>
  </UIHeader>
);

export default Header;
