import React from 'react';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import menuOpenImg from '../../img/menu.png';

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
    <div className="wkp-menu-toggle-button">
      <img alt="menu" src={menuOpenImg} />
      <span className="wkp-menu-toggle-text">Menü</span>
    </div>
    <div className={`wkp-menu-title ${!info ? '' : 'large'}`}>{title}</div>
    <div className="wkp-menu-toggler">
      {isOpen ? <FaAngleUp /> : <FaAngleDown />}
    </div>
    <div className={`wkp-menu-layers ${!info ? '' : 'hidden'}`}>{info}</div>
  </div>
);

MenuHeader.propTypes = propTypes;
MenuHeader.defaultProps = defaultProps;

export default MenuHeader;
