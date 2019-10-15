import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import { unByKey } from 'ol/Observable';
import MenuItemHeader from './MenuItemHeader';
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

  // mapStateToProps
  menuOpen: PropTypes.bool.isRequired,
  map: PropTypes.instanceOf(Map).isRequired,
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
    this.olEventKey = null;

    this.state = {
      menuHeight: null,
    };
  }

  componentDidMount() {
    const { map } = this.props;
    this.olEventKey = map.on('change:size', () => this.updateMenuHeight());
    window.clearTimeout(this.heightTimeout);
    this.heightTimeout = window.setTimeout(() => {
      this.updateMenuHeight();
    }, transitiondelay);
  }

  componentDidUpdate(prevProps) {
    const { menuOpen } = this.props;
    if (menuOpen !== prevProps.menuOpen) {
      window.clearTimeout(this.heightTimeout);
      this.heightTimeout = window.setTimeout(() => {
        this.updateMenuHeight();
      }, transitiondelay);
    }
  }

  componentWillUnmount() {
    unByKey(this.olEventKey);
    window.clearTimeout(this.heightTimeout);
  }

  updateMenuHeight() {
    const { map } = this.props;
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
  map: state.app.map,
});

const mapDispatchToProps = {};

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(MenuItem);
