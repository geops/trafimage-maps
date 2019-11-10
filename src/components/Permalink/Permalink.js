import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import Point from 'ol/geom/Point';
import { transform } from 'ol/proj';
import qs from 'query-string';
import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import RSPermalink from 'react-spatial/components/Permalink';
import LayerService from 'react-spatial/LayerService';

import { setCenter, setZoom } from '../../model/map/actions';
import {
  setDeparturesFilter,
  setClickedFeatureInfo,
} from '../../model/app/actions';

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
  departuresFilter: PropTypes.string,

  // mapDispatchToProps
  dispatchSetCenter: PropTypes.func.isRequired,
  dispatchSetZoom: PropTypes.func.isRequired,
  dispatchSetDeparturesFilter: PropTypes.func.isRequired,
  dispatchSetClickedFeatureInfo: PropTypes.func.isRequired,
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
    this.loadDepartureOnce = true;
    this.departures =
      departuresFilterKey && getUrlParamVal(parameters[departuresFilterKey]);

    dispatchSetDeparturesFilter(this.departures);

    this.setState({
      [lineFilterKey]: lineFilter,
      [routeFilterKey]: routeFilter,
      [operatorFilterKey]: operatorFilter,
      [departuresFilterKey]: this.departures,
    });
  }

  componentDidUpdate(prevProps) {
    const { activeTopic, history, departuresFilter, layerService } = this.props;

    if (history && activeTopic !== prevProps.activeTopic) {
      history.replace(`/${activeTopic.key}`);
    }

    if (departuresFilter !== prevProps.departuresFilter) {
      this.updateDepartures();
    }

    if (this.loadDepartureOnce && this.departures) {
      const stationsLayer = layerService.getLayer('ch.sbb.netzkarte.stationen');
      this.loadDepartureOnce = false;
      if (
        stationsLayer &&
        stationsLayer.mapboxLayer &&
        stationsLayer.mapboxLayer.mbMap
      ) {
        const { mbMap } = stationsLayer.mapboxLayer;

        // We need to wait until mapbox layer is loaded.
        if (mbMap.isStyleLoaded()) {
          this.openDepartureOnLoad.bind(this);
        } else {
          mbMap.on('load', this.openDepartureOnLoad.bind(this));
        }
      }
    }
  }

  openDepartureOnLoad() {
    const { layerService, dispatchSetClickedFeatureInfo } = this.props;
    const stationsLayer = layerService.getLayer('ch.sbb.netzkarte.stationen');
    const [departure] = stationsLayer
      .getFeatures()
      .filter(
        station => station.properties.didok === this.departures - 8500000,
      );

    if (!departure) {
      return;
    }
    const { latitude, longitude } = departure.properties;
    const stationFeature = new Feature({
      geometry: new Point(
        transform([longitude, latitude], 'EPSG:21781', 'EPSG:3857'),
      ),
      ...departure.properties,
    });

    // Open departure popup from departure define in URL on mapbbox layer load.
    dispatchSetClickedFeatureInfo([
      {
        coordinate: stationFeature.getGeometry().getCoordinates(),
        features: [stationFeature],
        // Fake layer binded to popup, to open it.
        layer: {
          getKey: () => 'ch.sbb.departure.popup',
          get: val => (val === 'popupComponent' ? 'DeparturePopup' : null),
        },
      },
    ]);

    // Unregister event listener to open only on page load.
    stationsLayer.mapboxLayer.mbMap.off('load', this.openDepartureOnLoad);
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
  dispatchSetClickedFeatureInfo: setClickedFeatureInfo,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Permalink);
