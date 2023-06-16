import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Collapsible.scss';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  transitionDuration: PropTypes.number,
  isCollapsed: PropTypes.bool.isRequired,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
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

    if (this.ref.current) {
      if (this.ref.current) {
        this.ref.current.removeEventListener('touchstart', this.onTouchStart);
        this.ref.current.removeEventListener('touchmove', this.onTouchMove);
      }
      if (this.ref.current) {
        this.ref.current.addEventListener('touchstart', this.onTouchStart);
        this.ref.current.addEventListener('touchmove', this.onTouchMove);
      }
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  onTouchStart(evt) {
    this.startY = evt.touches[0].clientY;
  }

  onTouchMove(evt) {
    // const { node } = this.state;
    const element = this.ref.current;
    this.startY = evt.touches[0].clientY;
    const goesUp = evt.touches[0].clientY - this.startY > 0;
    const top = element.scrollTop;
    const totalScroll = element.scrollHeight;
    const currentScroll = top + element.offsetHeight;
    if (element.scrollTop <= 0 && goesUp) {
      element.scrollTop = 0;
    } else if (!goesUp && currentScroll === totalScroll) {
      element.scrollTop = element.scrollHeight;
    }
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
        ref={this.ref} // (node) => this.setState({ node })}
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
