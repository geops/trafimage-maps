import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import { transitiondelay } from '../../themes/default/variables.scss';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string,
  map: PropTypes.instanceOf(Map).isRequired,
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

    const { map } = this.props;
    this.bodyElementRef = null;

    this.state = {
      menuHeight: null,
    };

    map.on('change:size', () => this.updateMenuHeight());
  }

  componentDidMount() {
    window.setTimeout(() => {
      this.updateMenuHeight();
    }, transitiondelay);
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
    const { map } = this.props;
    let menuHeight;

    if (this.bodyElementRef) {
      const mapBottom = map.getTarget().getBoundingClientRect().bottom;
      const elemRect = this.bodyElementRef.getBoundingClientRect();
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
      <div className={`wkp-menu ${className} ${open ? '' : 'closed'}`}>
        <div
          className="wkp-menu-title"
          role="button"
          tabIndex={0}
          onClick={() => onCollapseToggle(!collapsed)}
          onKeyPress={e => e.which === 13 && onCollapseToggle(!collapsed)}
        >
          <div className="wkp-menu-title-left">
            <div className="wkp-menu-title-icon">{icon}</div>
            {title}
          </div>

          <div className="wkp-menu-title-toggler">
            {collapsed ? <FaAngleDown /> : <FaAngleUp />}
          </div>
        </div>
        <div
          className={`wkp-menu-body ${collapsed ? 'collapsed' : ''}`}
          style={{ maxHeight: collapsed ? 0 : menuHeight }}
          ref={e => {
            this.bodyElementRef = e;
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  menuOpen: state.app.menuOpen,
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
