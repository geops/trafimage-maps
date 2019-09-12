import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  transitionDuration: PropTypes.number,
  isCollapsed: PropTypes.bool.isRequired,
  maxHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  type: PropTypes.oneOf(['vertical', 'horizontal']),
};

const defaultProps = {
  children: null,
  className: '',
  transitionDuration: 300,
  maxHeight: 1000,
  maxWidth: 1000,
  type: 'vertical',
};

let timeout;

const Collapsible = ({
  children,
  className,
  isCollapsed,
  maxHeight,
  maxWidth,
  transitionDuration,
  type,
}) => {
  const [isHidden, setHidden] = useState(false);
  const style = {};

  useEffect(() => {
    if (isHidden !== isCollapsed) {
      window.clearTimeout(timeout);
      const duration = isCollapsed ? transitionDuration : 0;
      timeout = window.setTimeout(() => setHidden(isCollapsed), duration);
    }
  });

  if (type === 'horizontal') {
    style.maxWidth = isCollapsed ? 0 : maxWidth;
  } else {
    style.maxHeight = isCollapsed ? 0 : maxHeight;
  }

  return (
    <div style={style} className={`${className} wkp-collapsible-${type}`}>
      {isHidden ? null : children}
    </div>
  );
};

Collapsible.propTypes = propTypes;
Collapsible.defaultProps = defaultProps;

export default Collapsible;
