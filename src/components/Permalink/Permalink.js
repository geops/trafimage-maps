import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import GeoJSON from "ol/format/GeoJSON";
import qs from "query-string";
import OLMap from "ol/Map";
import { fromLonLat } from "ol/proj";
import RSPermalink from "react-spatial/components/Permalink";
import KML from "react-spatial/utils/KML";
import { Layer } from "mobility-toolbox-js/ol";
import LayerService from "../../utils/LayerService";
import { setCenter, setZoom } from "../../model/map/actions";
import { stationsLayer, platformsLayer } from "../../config/ch.sbb.netzkarte";
import {
  setDeparturesFilter,
  setFeatureInfo,
  setLanguage,
  setDrawIds,
  setShowPopups,
  updateDrawEditLink,
} from "../../model/app/actions";
import {
  DRAW_PARAM,
  DRAW_OLD_PARAM,
  DRAW_REDIRECT_PARAM,
  MAPSET_PARENT_PARAM,
} from "../../utils/constants";

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  initialState: PropTypes.shape(),

  // mapStateToProps
  activeTopic: PropTypes.shape({
    key: PropTypes.string,
    disablePermalinkLayers: PropTypes.bool,
  }).isRequired,
  language: PropTypes.string.isRequired,
  map: PropTypes.instanceOf(OLMap).isRequired,
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)).isRequired,
  departuresFilter: PropTypes.string,
  platformFilter: PropTypes.string,
  drawUrl: PropTypes.string,
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
  dispatchSetShowPopups: PropTypes.func.isRequired,
};

const defaultProps = {
  history: undefined,
  initialState: {},
  departuresFilter: undefined,
  platformFilter: undefined,
  drawUrl: undefined,
  drawIds: undefined,
  mapsetUrl: undefined,
};

const format = new GeoJSON();

class Permalink extends PureComponent {
  constructor(props) {
    super(props);
    const { mapsetUrl } = this.props;

    const parameters = qs.parse(window.location.search);
    const wkpDraw = parameters[DRAW_OLD_PARAM];
    const drawId = parameters[DRAW_PARAM] || wkpDraw;

    // if the draw.redirect parameter is true, that means we must redirect the page to mapset.
    const mustRedirectToMapset = parameters[DRAW_REDIRECT_PARAM] === "true";
    if (drawId && mustRedirectToMapset && mapsetUrl) {
      const params = qs.parse(window.location.search);
      params[DRAW_PARAM] = drawId;
      delete params[DRAW_REDIRECT_PARAM];
      window.location.href = `${mapsetUrl}?${MAPSET_PARENT_PARAM}=${encodeURIComponent(
        `${window.location.href.split("?")[0]}?${qs.stringify(params)}`,
      )}`;
    }
  }

  componentDidMount() {
    const {
      dispatchSetZoom,
      dispatchSetCenter,
      dispatchSetLanguage,
      dispatchSetDrawIds,
      dispatchSetDeparturesFilter,
      dispatchSetShowPopups,
      initialState,
      language,
      drawUrl,
      drawLayer,
      map,
    } = this.props;

    const parameters = {
      ...qs.parse(window.location.search),
      ...initialState,
    };

    const drawId = parameters[DRAW_PARAM] || parameters[DRAW_OLD_PARAM];

    if (drawId) {
      fetch(`${drawUrl}${drawId}/?format=kml`)
        .then((response) =>
          response
            .clone()
            .json()
            .catch(() => response.text()),
        )
        .then((data) => {
          dispatchSetDrawIds({ file_id: drawId });
          return { text: () => data };
        })
        .then((response) => response.text())
        .then((data) => {
          if (data === "detail") {
            // eslint-disable-next-line no-console
            console.warn(`The KML ${drawId} can't be loaded:`, data);
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
      return param ? param.replace(/\s+/g, "") : undefined;
    };

    const z = parseFloat(parameters.z);
    let x = parseFloat(parameters.x);
    let y = parseFloat(parameters.y);
    const lon = parseFloat(parameters.lon);
    const lat = parseFloat(parameters.lat);

    // if coordinateas are in epsg:4326
    if (!x && !y && lon && lat) {
      [x, y] = fromLonLat([lon, lat]);
    }

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

    if (parameters.showpopups) {
      dispatchSetShowPopups(parameters.showpopups !== "false");
    }

    const lineFilterKey = getUrlParamKey(parameters, /publishedlinename/i);
    const routeFilterKey = getUrlParamKey(parameters, /tripnumber/i);
    const departuresFilterKey = getUrlParamKey(parameters, /departures/i);
    const platformFilterKey = getUrlParamKey(parameters, /platform/i);

    const lineFilter =
      lineFilterKey && getUrlParamVal(parameters[lineFilterKey]);
    const routeFilter =
      routeFilterKey && getUrlParamVal(parameters[routeFilterKey]);
    this.loadDepartureOnce = true;
    this.departures =
      departuresFilterKey && getUrlParamVal(parameters[departuresFilterKey]);
    this.platform =
      platformFilterKey && getUrlParamVal(parameters[platformFilterKey]);

    dispatchSetDeparturesFilter(this.departures, this.platform);

    const state = {
      lang: lang || language, // take from permalink, else from redux.
      [lineFilterKey]: lineFilter,
      [routeFilterKey]: routeFilter,
      [departuresFilterKey]: this.departures,
      [platformFilterKey]: this.platform,
      [DRAW_OLD_PARAM]: undefined,
      [DRAW_PARAM]: drawId,
      lon: undefined,
      lat: undefined,
    };
    this.setState(state);
  }

  componentDidUpdate(prevProps) {
    const {
      activeTopic,
      history,
      departuresFilter,
      language,
      drawIds,
      platformFilter,
      dispatchUpdateDrawEditLink,
    } = this.props;

    if (history && activeTopic !== prevProps.activeTopic) {
      history.replace(`/${activeTopic.key}${window.location.search}`);
    }

    if (
      departuresFilter !== prevProps.departuresFilter ||
      platformFilter !== prevProps.platformFilter
    ) {
      this.updateDepartures();
    }

    if (language !== prevProps.language) {
      this.updateLanguage();
    }

    if (this.loadDepartureOnce && this.departures) {
      this.loadDepartureOnce = false;

      // We need to wait until stations layer has been updated and rendered.
      stationsLayer.once("datarendered", () => {
        this.openDepartureOnLoad();
      });
    }

    if (drawIds !== prevProps.drawIds) {
      this.updateDrawIds();
    }

    dispatchUpdateDrawEditLink();
  }

  async openDepartureOnLoad() {
    const { dispatchSetFeatureInfo } = this.props;
    const { mbMap } = stationsLayer.mapboxLayer;

    const filter = ["all", ["==", ["get", "sbb_id"], this.departures]];

    if (this.platform) {
      filter.push(["==", ["get", "platform"], this.platform]);
    }

    const styleLayers = mbMap?.getStyle()?.layers || [];
    const layers = [
      ...styleLayers
        .filter(stationsLayer.styleLayersFilter)
        .map(({ id }) => id),
      ...styleLayers
        .filter(platformsLayer.styleLayersFilter)
        .map(({ id }) => id),
    ];

    // We display the departures popup only on features of the station layer (not on platform).
    const departures = mbMap.queryRenderedFeatures({
      layers,
      filter,
    });

    const [departure] = departures;
    if (!departure) {
      return;
    }

    const stationFeature = format.readFeature(departure, {
      featureProjection: "EPSG:3857",
    });
    stationFeature.set("mapboxFeature", departure);
    const geometry = stationFeature.getGeometry();

    // Feature can be a Point, LineString or a Polygon.
    let coordinate = geometry.getCoordinates();

    if (geometry.getCoordinateAt) {
      coordinate = geometry.getCoordinateAt(0.5);
    } else if (geometry.getInteriorPoint) {
      coordinate = geometry.getInteriorPoint().getCoordinates();
    }

    // Tells the NetzkartePopup to display the DeparturesPopup
    stationFeature.set("showDepartures", true);

    dispatchSetFeatureInfo([
      {
        coordinate,
        features: [stationFeature],
        layer: stationsLayer,
      },
    ]);
  }

  updateDrawIds() {
    const { drawIds } = this.props;
    let newState;

    // only for wkp draw management
    const parameters = {
      ...qs.parse(window.location.search),
    };
    const drawParam = drawIds && (drawIds.admin_id || drawIds.file_id);
    const wkpDraw = parameters[DRAW_OLD_PARAM];
    const drawId = parameters[DRAW_PARAM];
    if (wkpDraw && !drawId) {
      newState = { [DRAW_PARAM]: drawParam };
    } else {
      newState = {
        [DRAW_PARAM]: drawParam,
      };
    }
    this.setState(newState);
  }

  updateDepartures() {
    const { departuresFilter, platformFilter } = this.props;
    const state = {
      departures: departuresFilter,
      platform: platformFilter,
    };
    this.setState(state);
  }

  updateLanguage() {
    const { language } = this.props;
    this.setState({
      lang: language,
    });
  }

  render() {
    const { history, layers, map, activeTopic } = this.props;

    return (
      <RSPermalink
        params={{
          ...this.state,
        }}
        map={map}
        layers={!activeTopic.disablePermalinkLayers ? layers : undefined}
        history={history}
        isBaseLayer={(l) => l.get("isBaseLayer")}
        isLayerHidden={(l) =>
          l.get("hideInLegend") ||
          new LayerService(layers)
            .getParents(l)
            .some((pl) => pl.get("hideInLegend"))
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
  layers: state.map.layers,
  departuresFilter: state.app.departuresFilter,
  platformFilter: state.app.platformFilter,
  drawUrl: state.app.drawUrl,
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
  dispatchSetShowPopups: setShowPopups,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Permalink);
