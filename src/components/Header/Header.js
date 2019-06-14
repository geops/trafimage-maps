import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import LayerService from 'react-spatial/LayerService';
import RSHeader from 'react-spatial/components/Header';
import Autocomplete from 'react-spatial/components/Autocomplete';
import SBBLogo from '../../img/sbb-logo.png';

import './Header.scss';

const Header = () => (
  <RSHeader className="wkp-header">
    <div className="wkp-header-search">
      <Autocomplete
        value=""
        placeholder="Stationen, Verbindungen, Orte ..."
        button={
          <div className="wkp-search-button">
            <FaSearch />
          </div>
        }
      />
    </div>
    <div className="wkp-header-right">
      <img src={SBBLogo} alt="SBB Logo" />
    </div>
  </RSHeader>
);

export default Header;
