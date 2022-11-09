import React from 'react';
import PropTypes from 'prop-types';
import MenuItemHeader from './MenuItemHeader';
import Collapsible from '../Collapsible';
import withResizing from '../withResizing';

const propTypes = {
  menuHeight: PropTypes.number,
  fixedHeight: PropTypes.number,
  bodyElementRef: PropTypes.shape({
    current: PropTypes.instanceOf(Collapsible),
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string,
  open: PropTypes.bool.isRequired,
  collapsed: PropTypes.bool.isRequired,
  onCollapseToggle: PropTypes.func,
};

const defaultProps = {
  menuHeight: null,
  fixedHeight: null,
  bodyElementRef: null,
  children: null,
  className: '',
  icon: null,
  title: '',
  onCollapseToggle: () => {},
};

function MenuItem(props, ref) {
  const {
    open,
    collapsed,
    children,
    className,
    title,
    icon,
    onCollapseToggle,
    menuHeight,
    fixedHeight,
    bodyElementRef,
  } = props;

  return (
    <div
      ref={ref}
      className={`wkp-menu-item ${className} ${open ? '' : 'closed'}`}
    >
      {(title || icon) && (
        <MenuItemHeader
          icon={icon}
          title={title}
          isOpen={!collapsed}
          onToggle={() => onCollapseToggle(!collapsed)}
        />
      )}
      <Collapsible
        isCollapsed={collapsed}
        maxHeight={fixedHeight || menuHeight}
        ref={bodyElementRef}
        hideScrollbar
      >
        {children}
      </Collapsible>
    </div>
  );
}

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

// const WithResizingMenuItem = ;

export default React.memo(withResizing(React.forwardRef(MenuItem)));
//   React.forwardRef((props, ref) => {
//     // eslint-disable-next-line react/jsx-props-no-spreading
//     return <WithResizingMenuItem {...props} forwardedRef={ref} />;
//   }),
// );
