import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  transitionDuration: PropTypes.number,
  isCollapsed: PropTypes.bool.isRequired,
  maxHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  type: PropTypes.oneOf(['vertical', 'horizontal']),
  hideScrollbar: PropTypes.bool,
};

const defaultProps = {
  children: null,
  className: '',
  transitionDuration: 300,
  maxHeight: 2500,
  maxWidth: 1000,
  type: 'vertical',
  hideScrollbar: false,
};

class Collapsible extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      isHidden: false,
    };
  }

  componentDidUpdate() {
    const { isCollapsed, transitionDuration } = this.props;
    const { isHidden } = this.state;
    if (isHidden !== isCollapsed) {
      window.clearTimeout(this.timeout);
      const duration = isCollapsed ? transitionDuration : 0;
      this.timeout = window.setTimeout(
        () => this.setState({ isHidden: isCollapsed }),
        duration,
      );
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  render() {
    const {
      children,
      className,
      isCollapsed,
      maxHeight,
      maxWidth,
      transitionDuration,
      type,
      hideScrollbar,
    } = this.props;
    const { isHidden } = this.state;
    const style = {};

    if (type === 'horizontal') {
      style.maxWidth = isCollapsed ? 0 : maxWidth;
    } else {
      style.maxHeight = isCollapsed ? 0 : maxHeight;
      style.height = isCollapsed ? 0 : undefined;
    }

    if (isHidden !== isCollapsed) {
      const duration = isCollapsed ? transitionDuration : 0;
      window.clearTimeout(this.timeout);
      this.timeout = window.setTimeout(
        () => this.setState({ isHidden: isCollapsed }),
        duration,
      );
    }

    return (
      <div
        ref={this.ref}
        style={style}
        className={`${className} wkp-collapsible-${type}${
          hideScrollbar ? ' wkp-collapsible-hide-scrollbar' : ''
        }`}
      >
        {isHidden ? null : children}
      </div>
    );
  }
}

Collapsible.propTypes = propTypes;
Collapsible.defaultProps = defaultProps;

export default Collapsible;
