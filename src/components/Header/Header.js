import PropTypes from 'prop-types';
import UIHeader from '@geops/react-ui/components/Header';
import Login from '../Login';
// import { SBBLogo } from '../../img';
import { ReactComponent as SBBLogo } from '../../img/sbb-logo.svg';
import LanguageSelect from '../LanguageSelect';

import './Header.scss';

const propTypes = {
  appBaseUrl: PropTypes.string.isRequired,
};

const Header = ({ appBaseUrl }) => {
  return (
    <UIHeader className="wkp-header">
      <div className="wkp-header-right">
        <Login appBaseUrl={appBaseUrl} />
        <LanguageSelect />
        <div className="wkp-header-sbb-logo-wrapper">
          <SBBLogo focusable={false} className="wkp-header-sbb-logo" />
        </div>
      </div>
    </UIHeader>
  );
};

Header.propTypes = propTypes;

export default Header;
