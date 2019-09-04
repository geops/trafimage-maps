import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './Collapsible.scss';

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

  if (type === 'horizontal') {
    style.maxWidth = isCollapsed ? 0 : maxWidth;
  } else {
    style.maxHeight = isCollapsed ? 0 : maxHeight;
  }

  if (isHidden !== isCollapsed) {
    const duration = isCollapsed ? transitionDuration : 0;
    window.setTimeout(() => setHidden(isCollapsed), duration);
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
