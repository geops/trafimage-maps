/* eslint-disable jsx-a11y/no-access-key */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Function triggered on button's click event.
   */
  onClick: PropTypes.func.isRequired,

  /**
   * Children content of the button.
   */
  children: PropTypes.node,

  /**
   * CSS class of the button.
   */
  className: PropTypes.string,

  /**
   * HTML tabIndex attribute
   */
  tabIndex: PropTypes.number,

  /**
   * Title of the button.
   */
  title: PropTypes.string,

  /**
   * Keyboard accesskey shortcut.
   */
  accessKey: PropTypes.string,

  /**
   * Arai global attribute that indicates if the element is expandable.
   */
  ariaExpanded: PropTypes.bool,

  /**
   * HTML style attribute
   */
  style: PropTypes.object,

  /**
   * HTML disabled attribute
   */
  disabled: PropTypes.bool,
};

const defaultProps = {
  className: 'tm-button',
  children: undefined,
  title: undefined,
  tabIndex: 0,
  style: undefined,
  accessKey: undefined,
  ariaExpanded: undefined,
  disabled: undefined,
};

/**
 * This component displays a simple button.
 */
class Button extends PureComponent {
  render() {
    const {
      onClick,
      children,
      className,
      title,
      tabIndex,
      style,
      accessKey,
      ariaExpanded,
      disabled,
    } = this.props;

    return (
      <div
        role="button"
        style={style}
        tabIndex={tabIndex}
        className={className}
        title={title}
        aria-label={title}
        aria-expanded={ariaExpanded}
        onClick={(e) => {
          if (disabled) {
            return;
          }
          onClick(e);
        }}
        onKeyPress={(e) => e.which === 13 && onClick(e)}
        accessKey={accessKey}
        disabled={disabled}
      >
        {children}
      </div>
    );
  }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
