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

    this.state = {
      closed: false,
    };

    this.elementRef = null;
  }

  render() {
    const { children, className, title, icon, map } = this.props;
    const { closed } = this.state;
    const style = {};

    if (this.elementRef) {
      const mapBottom = map.getTarget().getBoundingClientRect().bottom;
      const elemRect = this.elementRef.getBoundingClientRect();
      style.maxHeight = mapBottom - elemRect.bottom - elemRect.top;
    }

    return (
      <div
        className={`wkp-menu ${className}`}
        style={style}
        ref={e => {
          this.elementRef = e;
        }}
      >
        <div
          className="wkp-menu-title"
          role="button"
          tabIndex={0}
          onClick={() => this.setState({ closed: !closed })}
          onKeyPress={e => e.which === 13 && this.setState({ closed: !closed })}
        >
          <div className="wkp-menu-title-left">
            <div className="wkp-menu-title-icon">{icon}</div>
            {title}
          </div>

          <div className="wkp-menu-title-toggler">
            {closed ? <FaAngleDown /> : <FaAngleUp />}
          </div>
        </div>
        <div className={`wkp-menu-body ${closed ? 'closed' : ''}`}>
          {children}
        </div>
      </div>
    );
  }
}

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;
export default MenuItem;
