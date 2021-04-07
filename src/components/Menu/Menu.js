import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import './Menu.scss';

const propTypes = {
  children: PropTypes.node.isRequired,
};

function Menu({ children }) {
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const className = useMemo(() => {
    return `wkp-menu-wrapper${menuOpen ? ' wkp-menu-wrapper-open' : ''}`;
  }, [menuOpen]);

  return <div className={className}>{children}</div>;
}

Menu.propTypes = propTypes;

export default memo(Menu);
