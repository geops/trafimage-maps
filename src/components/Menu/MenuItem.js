import React from 'react';
import PropTypes from 'prop-types';
import MenuItemHeader from './MenuItemHeader';
import Collapsible from '../Collapsible';
import withResizing from '../withResizing';

const propTypes = {
  menuHeight: PropTypes.number,
  bodyElementRef: PropTypes.shape({
    current: PropTypes.instanceOf(Collapsible),
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string,
  open: PropTypes.bool.isRequired,
  collapsed: PropTypes.bool.isRequired,
  onCollapseToggle: PropTypes.func.isRequired,
};

const defaultProps = {
  menuHeight: null,
  bodyElementRef: null,
  children: null,
  className: '',
  icon: null,
  title: '',
};

function MenuItem(props) {
  const {
    open,
    collapsed,
    children,
    className,
    title,
    icon,
    onCollapseToggle,
    menuHeight,
    bodyElementRef,
  } = props;

  return (
    <div className={`wkp-menu-item ${className} ${open ? '' : 'closed'}`}>
      <MenuItemHeader
        icon={icon}
        title={title}
        isOpen={!collapsed}
        onToggle={() => onCollapseToggle(!collapsed)}
      />
      <Collapsible
        isCollapsed={collapsed}
        maxHeight={menuHeight}
        ref={bodyElementRef}
      >
        {children}
      </Collapsible>
    </div>
  );
}

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default React.memo(withResizing(MenuItem));
