import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';

import './MenuItem.scss';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string,
  map: PropTypes.instanceOf(Map).isRequired,
  closed: PropTypes.bool.isRequired,
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
      collapsed: false,
      menuHeight: null,
    };

    map.on('change:size', () => this.updateMenuHeight());
  }

  componentDidMount() {
    this.updateMenuHeight();
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
    const { closed, children, className, title, icon } = this.props;
    const { collapsed, menuHeight } = this.state;

    return (
      <div className={`wkp-menu ${className} ${closed ? 'closed' : ''}`}>
        <div
          className="wkp-menu-title"
          role="button"
          tabIndex={0}
          onClick={() => this.setState({ collapsed: !collapsed })}
          onKeyPress={e =>
            e.which === 13 && this.setState({ collapsed: !collapsed })
          }
        >
          <div className="wkp-menu-title-left">
            <div className="wkp-menu-title-icon">{icon}</div>
            {title}
          </div>

          <div className="wkp-menu-title-toggler">
            {closed ? <FaAngleDown /> : <FaAngleUp />}
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

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;
export default MenuItem;
