import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import qs from 'query-string';
import OLMap from 'ol/Map';
import RSPermalink from 'react-spatial/components/Permalink';
import LayerService from 'react-spatial/LayerService';

import { setCenter, setZoom } from '../../model/map/actions';
import { setDeparturesFilter } from '../../model/app/actions';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  initialState: PropTypes.shape(),
  popupComponents: PropTypes.objectOf(PropTypes.string).isRequired,

  // mapStateToProps
  activeTopic: PropTypes.shape({
    key: PropTypes.string,
  }).isRequired,
  map: PropTypes.instanceOf(OLMap).isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  departuresFilter: PropTypes.string,

  // mapDispatchToProps
  dispatchSetCenter: PropTypes.func.isRequired,
  dispatchSetZoom: PropTypes.func.isRequired,
  dispatchSetDeparturesFilter: PropTypes.func.isRequired,
};

const defaultProps = {
  history: undefined,
  initialState: {},
  departuresFilter: undefined,
};

class Permalink extends PureComponent {
  componentDidMount() {
    const {
      dispatchSetZoom,
      dispatchSetCenter,
      initialState,
      layerService,
      popupComponents,
      dispatchSetDeparturesFilter,
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
    const departuresFilterKey = getUrlParamKey(parameters, /departures/i);

    const lineFilter =
      lineFilterKey && getUrlParamVal(parameters[lineFilterKey]);
    const routeFilter =
      routeFilterKey && getUrlParamVal(parameters[routeFilterKey]);
    const operatorFilter =
      operatorFilterKey && getUrlParamVal(parameters[operatorFilterKey]);
    const departures =
      departuresFilterKey && getUrlParamVal(parameters[departuresFilterKey]);

    dispatchSetDeparturesFilter(departures);

    if (
      departures &&
      popupComponents &&
      Object.keys(popupComponents).includes('ch.sbb.departure.popup')
    ) {
      // wait until mapbox is loaded
      const stationFeats = layerService
        .getLayer('ch.sbb.netzkarte.stationen')
        .getFeatures();
      const depature = stationFeats.filter(
        station => station.properties.didok === departures - 8500000,
      );
      // to fitler results and use to open departurePopup.
      console.log(depature);

      /*
      Netzkarte popup opens DeparturePopup with:
      dispatchSetClickedFeatureInfo([
        {
          coordinate: feature.getGeometry().getCoordinates()[0],
          features: [feature],
          // Fake layer binded to popup, to open it.
          layer: { getKey: () => 'ch.sbb.departure.popup' },
        },
      ]);
      */
    }

    this.setState({
      [lineFilterKey]: lineFilter,
      [routeFilterKey]: routeFilter,
      [operatorFilterKey]: operatorFilter,
      [departuresFilterKey]: departures,
    });
  }

  componentDidUpdate(prevProps) {
    const { activeTopic, history, departuresFilter } = this.props;

    if (history && activeTopic !== prevProps.activeTopic) {
      history.replace(`/${activeTopic.key}`);
    }

    if (departuresFilter !== prevProps.departuresFilter) {
      this.updateDepartures();
    }
  }

  updateDepartures() {
    const { departuresFilter } = this.props;
    this.setState({
      departures: departuresFilter,
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
  departuresFilter: state.app.departuresFilter,
});

const mapDispatchToProps = {
  dispatchSetCenter: setCenter,
  dispatchSetZoom: setZoom,
  dispatchSetDeparturesFilter: setDeparturesFilter,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Permalink);
