import React from 'react';
import RSHeader from 'react-spatial/components/Header';
import SBBLogo from '../../img/sbb-logo.png';

const Header = () => (
  <RSHeader className="wkp-header">
    <div className="wkp-header-right">
      <img src={SBBLogo} alt="SBB Logo" />
    </div>
  </RSHeader>
);

export default Header;
