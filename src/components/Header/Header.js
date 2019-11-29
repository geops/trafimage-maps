import React from 'react';
import RSHeader from 'react-spatial/components/Header';
import { ReactComponent as SBBLogo } from '../../img/sbb-logo.svg';

import './Header.scss';

const Header = () => (
  <RSHeader className="wkp-header">
    <div className="wkp-header-right">
      <SBBLogo focusable={false} />
    </div>
  </RSHeader>
);

export default Header;
