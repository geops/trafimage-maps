import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import qs from 'query-string';
import OLMap from 'ol/Map';
import RSPermalink from 'react-spatial/components/Permalink';

import { setCenter, setZoom } from '../../model/map/actions';

const propTypes = {
  activeTopic: PropTypes.shape({
    key: PropTypes.string,
  }).isRequired,
  map: PropTypes.instanceOf(OLMap),
  initialState: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),

  // mapDispatchToProps
  dispatchSetCenter: PropTypes.func.isRequired,
  dispatchSetZoom: PropTypes.func.isRequired,
};

const defaultProps = {
  map: undefined,
  initialState: {},
  history: undefined,
};

class Permalink extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
    };
  }

  componentDidMount() {
    const { initialState, dispatchSetZoom, dispatchSetCenter } = this.props;

    // Permalink has the priority over the initial state.
    const parameters = {
      ...initialState,
      ...qs.parse(window.location.search),
    };

    const z = parseInt(parameters.z, 10);
    const x = parseFloat(parameters.x);
    const y = parseFloat(parameters.y);

    if (x && y) {
      dispatchSetCenter([x, y]);
    }

    if (z) {
      dispatchSetZoom(z);
    }
  }

  componentDidUpdate(prevProps) {
    const { activeTopic, history } = this.props;

    if (history && activeTopic !== prevProps.activeTopic) {
      history.replace(`/${activeTopic.key}`);
    }
  }

  render() {
    const { history, map } = this.props;
    const { params } = this.state;

    return <RSPermalink map={map} params={params} history={history} />;
  }
}

Permalink.propTypes = propTypes;
Permalink.defaultProps = defaultProps;

// eslint-disable-next-line no-unused-vars
const mapStateToProps = state => ({
  activeTopic: state.app.activeTopic,
});

const mapDispatchToProps = {
  dispatchSetCenter: setCenter,
  dispatchSetZoom: setZoom,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Permalink);
