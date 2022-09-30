import React from 'react';
import PropTypes from 'prop-types';
import Login from '../Login';
import { ReactComponent as SBBLogo } from '../../img/sbb-logo.svg';
import LanguageSelect from '../LanguageSelect';

import './Header.scss';

const propTypes = {
  loginUrl: PropTypes.string,
};

const defaultProps = {
  loginUrl: undefined,
};

const Header = ({ loginUrl }) => {
  return (
    <div className="wkp-header">
      <div className="wkp-header-right">
        <Login loginUrl={loginUrl} />
        <LanguageSelect />
        <div className="wkp-header-sbb-logo-wrapper">
          <SBBLogo focusable={false} className="wkp-header-sbb-logo" />
        </div>
      </div>
    </div>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default React.memo(Header);
