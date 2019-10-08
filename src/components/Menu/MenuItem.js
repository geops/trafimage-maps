import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import MenuItemHeader from './MenuItemHeader';
import { AppContext } from '../TrafimageMaps/TrafimageMaps';
import Collapsible from '../Collapsible';
import { transitiondelay } from '../../Globals.scss';
import './MenuItem.scss';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string,
  open: PropTypes.bool.isRequired,
  collapsed: PropTypes.bool.isRequired,
  onCollapseToggle: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool.isRequired,
};

const defaultProps = {
  children: null,
  className: '',
  icon: null,
  title: '',
};

class MenuItem extends Component {
  constructor(props) {
    super(props);

    this.bodyElementRef = React.createRef();

    this.state = {
      menuHeight: null,
    };
  }

  componentDidMount() {
    const { map } = this.context;
    map.on('change:size', () => this.updateMenuHeight());
    this.updateMenuHeight();
  }

  componentDidUpdate(prevProps) {
    const { menuOpen } = this.props;
    if (menuOpen !== prevProps.menuOpen) {
      window.setTimeout(() => {
        this.updateMenuHeight();
      }, transitiondelay);
    }
  }

  updateMenuHeight() {
    const { map } = this.context;
    let menuHeight;

    if (
      this.bodyElementRef.current &&
      this.bodyElementRef.current.ref.current
    ) {
      const mapBottom = map.getTarget().getBoundingClientRect().bottom;
      const elemRect = this.bodyElementRef.current.ref.current.getBoundingClientRect();
      menuHeight = mapBottom - elemRect.top - 35;
    }

    this.setState({ menuHeight });
  }

  render() {
    const {
      open,
      collapsed,
      children,
      className,
      title,
      icon,
      onCollapseToggle,
    } = this.props;

    const { menuHeight } = this.state;

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
          ref={this.bodyElementRef}
        >
          {children}
        </Collapsible>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  menuOpen: state.app.menuOpen,
});

const mapDispatchToProps = {};

MenuItem.contextType = AppContext;
MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(MenuItem);
