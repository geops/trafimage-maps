import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import UIHeader from '@geops/react-ui/components/Header';
import { ReactComponent as SBBLogo } from '../../img/sbb-logo.svg';
import { ReactComponent as SBBUser } from '../../img/sbb/user_92_large.svg';
import LanguageSelect from '../LanguageSelect';

import './Header.scss';

const propTypes = {
  appBaseUrl: PropTypes.string.isRequired,
};

const Header = ({ appBaseUrl }) => {
  let login = 'Anmelden';
  const { t } = useTranslation();
  const permissionsInfos = useSelector(state => state.app.permissionsInfos);

  if (permissionsInfos && permissionsInfos.user) {
    login = permissionsInfos.user;
  }

  return (
    <UIHeader className="wkp-header">
      <div className="wkp-header-right">
        <div className="wkp-header-login">
          <a href={`${appBaseUrl}/login`}>
            <SBBUser focusable={false} className="wkp-header-login-icon" />
            <span className="wkp-header-login-text">{t(login)}</span>
          </a>
        </div>
        <LanguageSelect />
        <SBBLogo focusable={false} className="wkp-header-sbb-logo" />
      </div>
    </UIHeader>
  );
};

Header.propTypes = propTypes;

export default Header;
