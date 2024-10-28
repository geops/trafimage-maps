import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

/**
 * This component displays a simple button.
 * @ignore
 */
function Button({ children, disabled = false, onClick, ...props }) {
  return (
    <div
      role="button"
      tabIndex={0}
      {...props}
      onClick={(e) => {
        if (disabled) {
          return;
        }
        onClick(e);
      }}
      onKeyPress={(e) => e.which === 13 && onClick(e)}
    >
      {children}
    </div>
  );
}

Button.propTypes = propTypes;

export default Button;
