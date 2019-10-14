import React from 'react';
import PropTypes from 'prop-types';

import './Menu.scss';

const propTypes = {
  children: PropTypes.node.isRequired,
};

function Menu({ children }) {
  return <div className="wkp-menu-wrapper">{children}</div>;
}

Menu.propTypes = propTypes;

export default React.memo(Menu);
