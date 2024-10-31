import React from "react";
import PropTypes from "prop-types";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Button from "../Button";
import "./MenuItemHeader.scss";

const propTypes = {
  className: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  icon: PropTypes.node,
  isOpen: PropTypes.bool,
};

function MenuItemHeader({
  className = "wkp-menu-item-header",
  title,
  icon = null,
  isOpen = false,
  onToggle,
}) {
  return (
    <Button
      className={`${className}${isOpen ? " open" : ""}`}
      aria-expanded={isOpen}
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

export default React.memo(MenuItemHeader);
