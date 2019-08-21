import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import qs from 'query-string';
import OLMap from 'ol/Map';
import RSPermalink from 'react-spatial/components/Permalink';
import LayerService from 'react-spatial/LayerService';

import { setCenter, setZoom } from '../../model/map/actions';

const propTypes = {
  activeTopic: PropTypes.shape({
    key: PropTypes.string,
  }).isRequired,
  map: PropTypes.instanceOf(OLMap),
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  initialState: PropTypes.shape(),

  // mapDispatchToProps
  dispatchSetCenter: PropTypes.func.isRequired,
  dispatchSetZoom: PropTypes.func.isRequired,
};

const defaultProps = {
  map: undefined,
  history: undefined,
  initialState: {},
};

const TRAIN_FILTER = 'train_filter';
const OPERATOR_FILTER = 'operator_filter';

class Permalink extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatchSetZoom, dispatchSetCenter, initialState } = this.props;

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

    const trainFilter = parameters[TRAIN_FILTER];
    const operatorFilter = parameters[OPERATOR_FILTER];

    this.setState({
      [TRAIN_FILTER]: trainFilter,
      [OPERATOR_FILTER]: operatorFilter,
    });
  }

  componentDidUpdate(prevProps) {
    const { activeTopic, history } = this.props;

    if (history && activeTopic !== prevProps.activeTopic) {
      history.replace(`/${activeTopic.key}`);
    }
  }

  render() {
    const { history, layerService, map } = this.props;

    return (
      <RSPermalink
        map={map}
        params={{ ...this.state }}
        layerService={layerService}
        history={history}
      />
    );
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
