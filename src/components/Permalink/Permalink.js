import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import qs from 'query-string';
import OLMap from 'ol/Map';
import RSPermalink from 'react-spatial/components/Permalink';
import LayerService from 'react-spatial/LayerService';

import { setCenter, setZoom } from '../../model/map/actions';
import { setDestinationFilter } from '../../model/app/actions';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  initialState: PropTypes.shape(),

  // mapStateToProps
  activeTopic: PropTypes.shape({
    key: PropTypes.string,
  }).isRequired,
  map: PropTypes.instanceOf(OLMap).isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  destinationFilter: PropTypes.string,

  // mapDispatchToProps
  dispatchSetCenter: PropTypes.func.isRequired,
  dispatchSetZoom: PropTypes.func.isRequired,
  dispatchSetDestinationFilter: PropTypes.func.isRequired,
};

const defaultProps = {
  history: undefined,
  initialState: {},
  destinationFilter: undefined,
};

class Permalink extends PureComponent {
  componentDidMount() {
    const {
      dispatchSetZoom,
      dispatchSetCenter,
      initialState,
      dispatchSetDestinationFilter,
    } = this.props;

    const parameters = {
      ...qs.parse(window.location.search),
      ...initialState,
    };

    const getUrlParamKey = (params, regex) => {
      return Object.keys(params).find(key => {
        return regex.test(key);
      });
    };

    const getUrlParamVal = param => {
      // Remove spaces from value.
      return param ? param.replace(/\s+/g, '') : undefined;
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

    const lineFilterKey = getUrlParamKey(parameters, /publishedlinename/i);
    const routeFilterKey = getUrlParamKey(parameters, /tripnumber/i);
    const operatorFilterKey = getUrlParamKey(parameters, /operator/i);
    const destinationFilterKey = getUrlParamKey(parameters, /destination/i);

    const lineFilter =
      lineFilterKey && getUrlParamVal(parameters[lineFilterKey]);
    const routeFilter =
      routeFilterKey && getUrlParamVal(parameters[routeFilterKey]);
    const operatorFilter =
      operatorFilterKey && getUrlParamVal(parameters[operatorFilterKey]);
    const destination =
      destinationFilterKey && getUrlParamVal(parameters[destinationFilterKey]);

    dispatchSetDestinationFilter(destination);

    this.setState({
      [lineFilterKey]: lineFilter,
      [routeFilterKey]: routeFilter,
      [operatorFilterKey]: operatorFilter,
      [destinationFilterKey]: destination,
    });
  }

  componentDidUpdate(prevProps) {
    const { activeTopic, history, destinationFilter } = this.props;

    if (history && activeTopic !== prevProps.activeTopic) {
      history.replace(`/${activeTopic.key}`);
    }

    if (destinationFilter !== prevProps.destinationFilter) {
      this.updateDestination();
    }
  }

  updateDestination() {
    const { destinationFilter } = this.props;
    this.setState({
      destination: destinationFilter,
    });
  }

  render() {
    const { history, layerService, map } = this.props;

    return (
      <RSPermalink
        params={{ ...this.state }}
        map={map}
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
  map: state.app.map,
  layerService: state.app.layerService,
  destinationFilter: state.app.destinationFilter,
});

const mapDispatchToProps = {
  dispatchSetCenter: setCenter,
  dispatchSetZoom: setZoom,
  dispatchSetDestinationFilter: setDestinationFilter,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Permalink);
