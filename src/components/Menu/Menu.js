import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import './Menu.scss';

const propTypes = {
  children: PropTypes.node.isRequired,
};

function Menu({ children }) {
  const menuOpen = useSelector(state => state.app.menuOpen);

  return (
    <div
      className={`wkp-menu-wrapper${menuOpen ? ' wkp-menu-wrapper-open' : ''}`}
    >
      {children}
    </div>
  );
}

Menu.propTypes = propTypes;

export default React.memo(Menu);
