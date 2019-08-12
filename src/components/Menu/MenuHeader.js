import React from 'react';
import { compose } from 'lodash/fp';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import menuOpenImg from '../../img/menu_open.png';
import menuClosedImg from '../../img/menu_closed.png';

import './MenuHeader.scss';

const propTypes = {
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  info: PropTypes.string,
  isOpen: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

const defaultProps = {
  info: null,
  isOpen: false,
};

const MenuHeader = ({ title, info, isOpen, onToggle, t }) => (
  <div
    className={`wkp-menu-header ${isOpen ? 'open' : ''}`}
    role="button"
    tabIndex="0"
    onClick={() => onToggle()}
    onKeyPress={e => e.which === 13 && onToggle()}
  >
    <div className="wkp-menu-toggle-button">
      <div className="wkp-menu-toggle-button-icon">
        <img src={isOpen ? menuClosedImg : menuOpenImg} alt={t('Menü')} />
      </div>
      <span className="wkp-menu-toggle-text">{t('Menü')}</span>
    </div>
    <div className={`wkp-menu-title ${!info ? '' : 'large'}`}>{t(title)}</div>
    <div className="wkp-menu-toggler">
      {isOpen ? <FaAngleUp /> : <FaAngleDown />}
    </div>
    <div className={`wkp-menu-layers ${!info ? '' : 'hidden'}`}>{info}</div>
  </div>
);

MenuHeader.propTypes = propTypes;
MenuHeader.defaultProps = defaultProps;

export default compose(withTranslation())(MenuHeader);
