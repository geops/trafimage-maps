import React from 'react';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Button from '../Button';

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

function MenuItemHeader({ className, title, icon, isOpen, onToggle }) {
  return (
    <Button
      className={`${className}${isOpen ? ' open' : ''}`}
      ariaExpanded={isOpen}
      onClick={() => onToggle()}
    >
      {icon && <div className="wkp-menu-item-header-icon">{icon}</div>}
      <div className="wkp-menu-item-header-title">{title}</div>
      <div className="wkp-menu-item-header-toggler">
        {isOpen ? <FaAngleUp /> : <FaAngleDown />}
      </div>
    </Button>
  );
}

MenuItemHeader.propTypes = propTypes;
MenuItemHeader.defaultProps = defaultProps;

export default React.memo(MenuItemHeader);
