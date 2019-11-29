import React from 'react';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Button from '@geops/react-ui/components/Button';
import './MenuItemHeader.scss';

const propTypes = {
  className: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  icon: PropTypes.node,
  isOpen: PropTypes.bool,
};

const defaultProps = {
  className: 'wkp-menu-item-header',
  isOpen: false,
  icon: null,
};

const MenuItemHeader = ({ className, title, icon, isOpen, onToggle }) => (
  <Button
    className={`${className}${isOpen ? ' open' : ''}`}
    onClick={() => onToggle()}
  >
    {icon && <div className="wkp-menu-item-header-icon">{icon}</div>}
    <div className="wkp-menu-item-header-title">{title}</div>
    <div className="wkp-menu-item-header-toggler">
      {isOpen ? <FaAngleUp /> : <FaAngleDown />}
    </div>
  </Button>
);

MenuItemHeader.propTypes = propTypes;
MenuItemHeader.defaultProps = defaultProps;

export default React.memo(MenuItemHeader);
