import React, { Component } from 'react';
import Map from 'ol/Map';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { unByKey } from 'ol/Observable';

const transitiondelay = 300;

function withResizing(MenuToBeResized) {
  const propTypes = {
    menuOpen: PropTypes.bool.isRequired,
    map: PropTypes.instanceOf(Map).isRequired,
  };

  const mapStateToProps = state => ({
    menuOpen: state.app.menuOpen,
    map: state.app.map,
  });

  class ResizedWrapper extends Component {
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

      if (menuHeight >= 0) {
        this.setState({ menuHeight });
      }
    }

    render() {
      const { menuHeight } = this.state;

      return (
        <MenuToBeResized
          bodyElementRef={this.bodyElementRef}
          menuHeight={menuHeight}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...this.props}
        />
      );
    }
  }

  ResizedWrapper.propTypes = propTypes;

  return connect(mapStateToProps)(ResizedWrapper);
}

export default withResizing;
