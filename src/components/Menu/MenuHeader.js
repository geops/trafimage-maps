import React from 'react';
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
};

const defaultProps = {
  info: null,
  isOpen: false,
};

const MenuHeader = ({ title, info, isOpen, onToggle }) => (
  <div
    className={`wkp-menu-header ${isOpen ? 'open' : ''}`}
    role="button"
    tabIndex="0"
    onClick={() => onToggle()}
    onKeyPress={e => e.which === 13 && onToggle()}
  >
    <div className="wkp-menu-header-toggler">
      <div className="wkp-menu-header-toggler-icon">
        <img src={isOpen ? menuClosedImg : menuOpenImg} alt="Menü" />
      </div>
      <span className="wkp-menu-toggle-text">Menü</span>
    </div>
    <div className={`wkp-menu-header-title ${!info ? '' : 'large'}`}>
      {title}
    </div>
    <div className="wkp-menu-toggler">
      {isOpen ? <FaAngleUp /> : <FaAngleDown />}
    </div>
    <div className={`wkp-menu-layers ${!info ? '' : 'hidden'}`}>{info}</div>
  </div>
);

MenuHeader.propTypes = propTypes;
MenuHeader.defaultProps = defaultProps;

export default MenuHeader;
