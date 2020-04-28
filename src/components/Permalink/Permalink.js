import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import GeoJSON from 'ol/format/GeoJSON';
import qs from 'query-string';
import OLMap from 'ol/Map';
import RSPermalink from 'react-spatial/components/Permalink';
import LayerService from 'react-spatial/LayerService';
import { redirect } from '../../utils/redirectHelper';
import { setCenter, setZoom } from '../../model/map/actions';
import {
  setDeparturesFilter,
  setFeatureInfo,
  setLanguage,
} from '../../model/app/actions';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  initialState: PropTypes.shape(),
  appBaseUrl: PropTypes.string,

  // mapStateToProps
  activeTopic: PropTypes.shape({
    key: PropTypes.string,
  }).isRequired,
  language: PropTypes.string.isRequired,
  map: PropTypes.instanceOf(OLMap).isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  departuresFilter: PropTypes.string,

  // mapDispatchToProps
  dispatchSetLanguage: PropTypes.func.isRequired,
  dispatchSetCenter: PropTypes.func.isRequired,
  dispatchSetZoom: PropTypes.func.isRequired,
  dispatchSetDeparturesFilter: PropTypes.func.isRequired,
  dispatchSetFeatureInfo: PropTypes.func.isRequired,
};

const defaultProps = {
  history: undefined,
  appBaseUrl: null,
  initialState: {},
  departuresFilter: undefined,
};

const format = new GeoJSON();

class Permalink extends PureComponent {
  componentDidMount() {
    const {
      appBaseUrl,
      dispatchSetZoom,
      dispatchSetCenter,
      dispatchSetLanguage,
      initialState,
      language,
      dispatchSetDeparturesFilter,
    } = this.props;

    const parameters = {
      ...qs.parse(window.location.search),
      ...initialState,
    };

    if (parameters['wkp.draw']) {
      // Redirection to the old wkp to use the drawing tool.
      redirect(appBaseUrl, 'ch.sbb.netzkarte.draw');
    }

    const getUrlParamKey = (params, regex) => {
      return Object.keys(params).find((key) => {
        return regex.test(key);
      });
    };

    const getUrlParamVal = (param) => {
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

    const { lang } = parameters;
    if (lang) {
      dispatchSetLanguage(lang);
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
      lang: lang || language, // take from permalink, else from redux.
      [lineFilterKey]: lineFilter,
      [routeFilterKey]: routeFilter,
      [operatorFilterKey]: operatorFilter,
      [departuresFilterKey]: this.departures,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      activeTopic,
      history,
      departuresFilter,
      layerService,
      language,
    } = this.props;

    if (history && activeTopic !== prevProps.activeTopic) {
      history.replace(`/${activeTopic.key}${window.location.search}`);
    }

    if (departuresFilter !== prevProps.departuresFilter) {
      this.updateDepartures();
    }

    if (language !== prevProps.language) {
      this.updateLanguage();
    }

    if (this.loadDepartureOnce && this.departures) {
      const dataLayer = layerService.getLayer('ch.sbb.netzkarte.data');
      this.loadDepartureOnce = false;
      if (dataLayer && dataLayer.mbMap) {
        const { mbMap } = dataLayer;

        // We need to wait until mapbox layer is loaded.
        dataLayer.on('load', () => {
          // then we wait the stations source has been updated.
          mbMap.once('idle', this.openDepartureOnLoad.bind(this));
        });
      }
    }
  }

  async openDepartureOnLoad() {
    const { layerService, dispatchSetFeatureInfo } = this.props;
    const dataLayer = layerService.getLayer('ch.sbb.netzkarte.data');
    const departures = dataLayer.getFeatures({
      source: 'base',
      sourceLayer: 'osm_points',
      filter: ['==', ['get', 'sbb_id'], this.departures],
    });

    const [departure] = departures;
    if (!departure) {
      return;
    }

    const stationFeature = format.readFeature(departure, {
      featureProjection: 'EPSG:3857',
    });

    dispatchSetFeatureInfo([
      {
        coordinate: stationFeature.getGeometry().getCoordinates(),
        features: [stationFeature],
        // Fake layer binded to popup, to open it.
        layer: {
          getKey: () => 'ch.sbb.departure.popup',
          get: (val) => (val === 'popupComponent' ? 'DeparturePopup' : null),
        },
      },
    ]);
  }

  updateDepartures() {
    const { departuresFilter } = this.props;
    this.setState({
      departures: departuresFilter,
    });
  }

  updateLanguage() {
    const { language } = this.props;
    this.setState({
      lang: language,
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
        isLayerHidden={(l) =>
          l.get('hideInLegend') ||
          layerService.getParents(l).some((pl) => pl.get('hideInLegend'))
        }
      />
    );
  }
}

Permalink.propTypes = propTypes;
Permalink.defaultProps = defaultProps;

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state) => ({
  activeTopic: state.app.activeTopic,
  map: state.app.map,
  language: state.app.language,
  layerService: state.app.layerService,
  departuresFilter: state.app.departuresFilter,
});

const mapDispatchToProps = {
  dispatchSetCenter: setCenter,
  dispatchSetZoom: setZoom,
  dispatchSetLanguage: setLanguage,
  dispatchSetDeparturesFilter: setDeparturesFilter,
  dispatchSetFeatureInfo: setFeatureInfo,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Permalink);
