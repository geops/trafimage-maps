import "react-app-polyfill/stable";
import qs from "query-string";
import OLVectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import MultiLineString from "ol/geom/MultiLineString";
import Feature from "ol/Feature";
import {
  Style,
  Fill as FillStyle,
  Icon as IconStyle,
  Stroke as StrokeStyle,
  Circle as CircleStyle,
} from "ol/style";
import { Point } from "ol/geom";
import CasaLayer from "../CasaLayer";
// use flag png to ensure IE detects it in olMap.forEachLayerAtPixel.
import finishFlag from "../../img/finish_flag.png";

/**
 * Layer for visualizing routes.
 *
 * <img src="img/layers/RouteLayer/layer.png" alt="Layer preview" title="Layer preview">
 * @class RouteLayer
 * @extends CasaLayer
 * @param {Object} [options] Layer options.
 *   Default is `{ rail: '#e3000b', bus: '#ffed00', ferry: '#0074be' }`.
 * @param {string} [options.url = https://api.geops.io/routing/v1] Url to fetch routes.
 */
class RouteLayer extends CasaLayer {
  static getCircleStyle = (coords) =>
    new Style({
      geometry: new Point(coords),
      image: new CircleStyle({
        radius: 3,
        fill: new FillStyle({
          color: [255, 255, 255],
        }),
        stroke: new StrokeStyle({
          color: [0, 0, 0],
          width: 1,
        }),
      }),
      zIndex: 1,
    });

  constructor(options = {}) {
    const properties = { isQueryable: true, ...(options.properties || {}) };
    super({
      name: "RouteLayer",
      olLayer: new OLVectorLayer({
        className: "RouteLayer", // needed for forEachLayerAtPixel
        style: (f) => this.routeStyle(f),
        source: new VectorSource(),
      }),
      ...options,
      properties,
    });
    this.set("showPopupOnHover", (features = []) => {
      return features.filter((f) => {
        const { popupContent } = f.get("route");
        if (
          popupContent &&
          (!Array.isArray(popupContent) ||
            !popupContent.every((item) => typeof item === "string"))
        ) {
          throw new Error(
            `Popup content was provided with type ${typeof popupContent}. Please use an array of strings instead (e.g. ['some content', 'more content']).`,
          );
        }
        return popupContent;
      });
    });
    this.set("popupComponent", "CasaRoutePopup");

    this.featuresLayer = this.olLayer;

    this.url = options.url || "https://api.geops.io/routing/v1";

    this.selectedRouteIds = [];

    this.onClick((features) => {
      if (features.length) {
        const [feature] = features;
        const { isClickable, routeId } = feature.get("route");

        if (isClickable) {
          const idx = this.selectedRouteIds.indexOf(routeId);
          if (idx > -1) {
            this.selectedRouteIds.splice(idx, 1);
          } else {
            this.selectedRouteIds.push(routeId);
          }

          this.olLayer.changed();
        }
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  hidePopup(feature) {
    return !feature.get("route").popupContent;
  }

  /**
   * Default style function for the route layer.
   * @private
   */
  // eslint-disable-next-line class-methods-use-this
  defaultStyleFunction(feature, isSelected, isHovered) {
    const motLineStyles = {
      rail: { color: [235, 0, 0] },
      bus: { color: [255, 255, 0] },
      funicular: { color: [0, 151, 59] },
      ferry: { color: [255, 255, 255] },
      foot: { color: [69, 118, 162], lineDash: [1, 10] },
    };

    const lineStyle = motLineStyles[feature.get("mot")];
    const opacity = isSelected || isHovered ? 1 : 0.3;
    const rgb = (lineStyle && lineStyle.color) || [68, 68, 68];
    const lineDash = (lineStyle && lineStyle.lineDash) || null;

    const style = {
      stroke: {
        color: [...rgb, opacity],
        width: 6,
        lineDash,
      },
    };

    if (isHovered) {
      style.hoverStyles = {
        outline: {
          color: "black",
          width: 8,
        },
      };

      if (lineDash) {
        // Add white background if there is a line dash
        style.hoverStyles.background = {
          color: "white",
          width: 6,
        };
      }
    }

    return style;
  }

  /**
   * Getting the Mot-features on specific route.
   * @private
   * @param {Object} viaPoints Route Informations
   * @param {String} mot Ask for specific Route
   * @param {Object[]} sequenceProps Properties for the returned features.
   * @param {Boolean} isStart Determines if the sequence is the first of the route.
   * @param {Boolean} isEnd Determines if the sequence is the final of the route.
   * @returns {array<ol.Feature>} Features
   */
  fetchRouteForMot(viaPoints, mot, sequenceProps, isStart, isEnd) {
    this.abortController = new AbortController();

    const via = viaPoints.map((viaPoint) => {
      if (Array.isArray(viaPoint)) {
        return `${viaPoint[0]},${viaPoint[1]}`;
      }
      return `!${viaPoint}`;
    });

    const urlParams = {
      profile: "sbb",
      [this.apiKeyName || "key"]: this.apiKey || "",
      via: via.join("|"),
      mot,
    };

    const url = `${this.url}/?${qs.stringify(urlParams)}`;
    const format = new GeoJSON({
      dataProjection: "EPSG:4326",
      featureProjection: this.projection,
    });

    return fetch(url, { signal: this.abortController.signal })
      .then((res) => res.json())
      .then((data) => {
        const lineStrings = format.readFeatures(data);
        const feature = new Feature({
          geometry: new MultiLineString(
            lineStrings.map((l) => l.getGeometry()),
          ),
        });
        feature.setProperties({
          ...sequenceProps,
          isStart,
          isEnd,
        });
        return feature;
      })
      .catch(() => {
        // Ignore failed API requests.
      });
  }

  /**
   * Returns the style of the given feature.
   * @private
   * @param {ol.feature} feature {@link https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html ol/Feature}
   * @returns {ol.style} get the feature's style function.
   */
  routeStyle(feature) {
    const { routeId } = feature.get("route");
    const isSelected = this.selectedRouteIds.includes(routeId);
    const isHovered =
      this.hoverFeature &&
      (this.hoverFeature.get("route") || {}).isClickable &&
      (this.hoverFeature.get("route") || {}).routeId === routeId;

    const routeStyle = this.styleFunction(
      feature.getProperties(),
      isSelected,
      isHovered,
    );

    const styleArray = Object.values(
      this.getOlStylesFromObject(routeStyle, isSelected, isHovered, feature),
    ).flat();

    if (isSelected) {
      /* Set route start and end style on selected routes */
      const lineStart = feature.getGeometry().getFirstCoordinate();
      const lineEnd = feature.getGeometry().getLastCoordinate();

      /* Set circle icon if it is the first sequence of a route */
      if (feature.get("isStart")) {
        styleArray.push(RouteLayer.getCircleStyle(lineStart));
      }

      /* Set flag and circle icons if it is the final sequence of a route */
      if (feature.get("isEnd")) {
        styleArray.push(RouteLayer.getCircleStyle(lineEnd));
        styleArray.push(
          new Style({
            geometry: new Point(lineEnd),
            image: new IconStyle({
              src: finishFlag,
              anchor: [4.5, 3.5],
              anchorXUnits: "pixels",
              anchorYUnits: "pixels",
              anchorOrigin: "bottom-left",
              imgSize: [24, 24],
              crossOrigin: "anonymous", // To ensure IE detects it in olMap.forEachLayerAtPixel.
            }),
            zIndex: 1,
          }),
        );
      }
    }

    return styleArray;
  }

  /**
   * @typedef {Object} Sequence
   * @property {Array<number>} uicFrom UIC number of start station.
   * @property {number} uicTo UIC number of end station.
   * @property {number} lonLatTo Lat/Lon coordinate array of end location
   *  (to be used if uicTo not provided).
   * @property {Array<number>} lonLatFrom Lat/Lon coordinate array of start location
   *  (to be used if uicFrom not provided).
   * @property {string} mot Method of transportation.
   *   Allowed values are "rail", "bus", "tram", "subway", "gondola",
   *   "funicular" and "ferry"
   */

  /**
   * @typedef {Object} Route
   * @property {boolean} isSelected If true, the route is
   *   selected initially.
   * @property {boolean} isClickable If true, the route can be
   *   selected or unselected by click.
   * @property {Array<Sequence>} sequences Route sequences.
   */

  /**
   * @param {Array<Route>} routes
   * @returns {Promise<Feature[]>} Promise resolving OpenLayers features.
   */
  loadRoutes(routes) {
    const routePromises = [];

    for (let i = 0; i < routes.length; i += 1) {
      let via = [];

      if (!routes[i].sequences) {
        throw new Error("Missing route sequences.");
      }

      for (let j = 0; j < routes[i].sequences.length; j += 1) {
        const { mot, uicFrom, uicTo, lonLatFrom, lonLatTo } =
          routes[i].sequences[j];
        const nextMot =
          j === routes[i].sequences.length - 1
            ? null
            : routes[i].sequences[j + 1].mot;

        via = via.concat([uicFrom || lonLatFrom, uicTo || lonLatTo]);

        if (mot !== nextMot) {
          const sequenceProps = { route: { ...routes[i], routeId: i }, mot };
          routePromises.push(
            this.fetchRouteForMot(
              via,
              mot,
              sequenceProps,
              j === 0,
              j === routes[i].sequences.length - 1,
            ),
          );
          via = [];
        }
      }
    }

    return Promise.all(routePromises).then((data) => {
      const sequenceFeatures = data.flat().filter((f) => f);
      this.olLayer.getSource().addFeatures(sequenceFeatures);
      sequenceFeatures.forEach((f) => {
        const { routeId, isSelected } = f.get("route");
        if (isSelected && this.selectedRouteIds.indexOf(routeId) === -1) {
          this.selectedRouteIds.push(routeId);
        }
      });
      return sequenceFeatures;
    });
  }

  /**
   * Zoom to route.
   * @param {Object} [fitOptions] Options,
   *   see {@link https://openlayers.org/en/latest/apidoc/module-ol_View-View.html ol/View~View}
   */
  zoomToRoute(options) {
    const fitOptions = { padding: [20, 20, 20, 20], ...options };
    if (this.map) {
      this.map.getView().fit(this.olLayer.getSource().getExtent(), fitOptions);
    }
  }

  /**
   * Clears the layer.
   */
  clear() {
    if (this.abortController && !this.abortController.signal.aborted) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.selectedRouteIds = [];
    this.olLayer.getSource().clear();
  }
}

export default RouteLayer;
