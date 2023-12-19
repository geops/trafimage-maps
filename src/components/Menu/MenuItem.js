import React from "react";
import PropTypes from "prop-types";
import MenuItemHeader from "./MenuItemHeader";
import Collapsible from "../Collapsible";
import withResizing from "../withResizing";

const propTypes = {
  menuHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fixedHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bodyElementRef: PropTypes.shape({
    current: PropTypes.instanceOf(Collapsible),
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  open: PropTypes.bool.isRequired,
  collapsed: PropTypes.bool.isRequired,
  onCollapseToggle: PropTypes.func,
};

const defaultProps = {
  menuHeight: null,
  fixedHeight: null,
  bodyElementRef: null,
  children: null,
  className: "",
  icon: null,
  title: "",
  onCollapseToggle: () => {},
};

const ForwardedRefComp = React.forwardRef((props, ref) => {
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
      className={`wkp-menu-item ${className} ${open ? "" : "closed"}`}
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
});

ForwardedRefComp.propTypes = propTypes;
ForwardedRefComp.defaultProps = defaultProps;

export default React.memo(withResizing(ForwardedRefComp));
