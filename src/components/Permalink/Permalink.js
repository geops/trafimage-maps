import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import GeoJSON from 'ol/format/GeoJSON';
import qs from 'query-string';
import OLMap from 'ol/Map';
import RSPermalink from 'react-spatial/components/Permalink';
import LayerService from 'react-spatial/LayerService';
import KML from 'react-spatial/utils/KML';
import { Layer } from 'mobility-toolbox-js/ol';
import { setCenter, setZoom } from '../../model/map/actions';
import {
  setDeparturesFilter,
  setFeatureInfo,
  setLanguage,
  setDrawIds,
  updateDrawEditLink,
} from '../../model/app/actions';
import {
  DRAW_PARAM,
  DRAW_OLD_PARAM,
  DRAW_REDIRECT_PARAM,
  MAPSET_PARENT_PARAM,
} from '../../utils/constants';

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
  language: PropTypes.string.isRequired,
  map: PropTypes.instanceOf(OLMap).isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  departuresFilter: PropTypes.string,
  drawUrl: PropTypes.string,
  drawOldUrl: PropTypes.string,
  drawLayer: PropTypes.instanceOf(Layer).isRequired,
  drawIds: PropTypes.object,
  mapsetUrl: PropTypes.string,

  // mapDispatchToProps
  dispatchSetLanguage: PropTypes.func.isRequired,
  dispatchSetCenter: PropTypes.func.isRequired,
  dispatchSetZoom: PropTypes.func.isRequired,
  dispatchSetDeparturesFilter: PropTypes.func.isRequired,
  dispatchSetFeatureInfo: PropTypes.func.isRequired,
  dispatchSetDrawIds: PropTypes.func.isRequired,
  dispatchUpdateDrawEditLink: PropTypes.func.isRequired,
};

const defaultProps = {
  history: undefined,
  initialState: {},
  departuresFilter: undefined,
  drawUrl: undefined,
  drawOldUrl: undefined,
  drawIds: undefined,
  mapsetUrl: undefined,
};

const format = new GeoJSON();

class Permalink extends PureComponent {
  componentDidMount() {
    const {
      dispatchSetZoom,
      dispatchSetCenter,
      dispatchSetLanguage,
      dispatchSetDrawIds,
      dispatchSetDeparturesFilter,
      initialState,
      language,
      drawUrl,
      drawOldUrl,
      drawLayer,
      map,
      mapsetUrl,
    } = this.props;

    const parameters = {
      ...qs.parse(window.location.search),
      ...initialState,
    };

    const wkpDraw = parameters[DRAW_OLD_PARAM];
    const drawId = parameters[DRAW_PARAM] || wkpDraw;

    // if the draw.redirect parameter is true, that means we must redirect the page to mapset.
    const mustRedirectToMapset = parameters[DRAW_REDIRECT_PARAM] === 'true';
    if (drawId && mustRedirectToMapset && mapsetUrl) {
      const params = qs.parse(window.location.search);
      params[DRAW_PARAM] = drawId;
      delete params[DRAW_REDIRECT_PARAM];
      window.location.href = `${mapsetUrl}?${MAPSET_PARENT_PARAM}=${encodeURIComponent(
        `${window.location.href.split('?')[0]}?${qs.stringify(params)}`,
      )}`;
    }

    if (drawId) {
      // Redirection to the old wkp to use the drawing tool.
      // redirect(appBaseUrl, 'ch.sbb.netzkarte.draw');
      fetch(`${(wkpDraw ? drawOldUrl : drawUrl) + drawId}`)
        .then((response) =>
          response
            .clone()
            .json()
            .catch(() => response.text()),
        )
        .then((data) => {
          if (data && data.admin_id && data.file_id) {
            dispatchSetDrawIds(data);
            return fetch((wkpDraw ? drawOldUrl : drawUrl) + data.file_id);
          }

          dispatchSetDrawIds({ file_id: drawId });
          return { text: () => data };
        })
        .then((response) => response.text())
        .then((data) => {
          if (data && data.error) {
            // eslint-disable-next-line no-console
            console.warn(`The KML ${drawId} can't be loaded:`, data.error);
            return;
          }
          // TO REMOVE. This will be fixed during migration of kmls
          // Old trafimage generates absolute urls in the kml for SBB images.
          // So we replace all of them by the complete url to old trafimage.
          const newKmlString = data.replace(
            />static\/app_trafimage/g,
            `>https://maps.trafimage.ch/static/app_trafimage`,
          );

          const features = KML.readFeatures(
            newKmlString,
            map.getView().getProjection(),
            map.getView().getResolution(),
          );

          // eslint-disable-next-line no-console
          drawLayer.olLayer.getSource().clear(true);
          drawLayer.olLayer.getSource().addFeatures(features);
        });
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
      drawIds,
      dispatchUpdateDrawEditLink,
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

    if (drawIds !== prevProps.drawIds) {
      this.updateDrawIds();
    }

    dispatchUpdateDrawEditLink();
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
          key: 'ch.sbb.departure.popup',
          get: (val) => (val === 'popupComponent' ? 'DeparturePopup' : null),
        },
      },
    ]);
  }

  updateDrawIds() {
    const { drawIds } = this.props;
    let newState;

    // only for wkp dra wmanagement
    const parameters = {
      ...qs.parse(window.location.search),
    };
    const drawParam = drawIds && (drawIds.admin_id || drawIds.file_id);
    const wkpDraw = parameters[DRAW_OLD_PARAM];
    const drawId = parameters[DRAW_PARAM];
    if (wkpDraw && !drawId) {
      newState = { [DRAW_OLD_PARAM]: drawParam };
    } else {
      newState = {
        [DRAW_PARAM]: drawParam,
      };
    }
    this.setState(newState);
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
        params={{
          ...this.state,
        }}
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
  drawUrl: state.app.drawUrl,
  drawOldUrl: state.app.drawOldUrl,
  drawLayer: state.map.drawLayer,
  drawIds: state.app.drawIds,
  mapsetUrl: state.app.mapsetUrl,
});

const mapDispatchToProps = {
  dispatchSetCenter: setCenter,
  dispatchSetZoom: setZoom,
  dispatchSetLanguage: setLanguage,
  dispatchSetDeparturesFilter: setDeparturesFilter,
  dispatchSetFeatureInfo: setFeatureInfo,
  dispatchSetDrawIds: setDrawIds,
  dispatchUpdateDrawEditLink: updateDrawEditLink,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Permalink);
