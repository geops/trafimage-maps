import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import qs from 'query-string';
import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import MultiLineString from 'ol/geom/MultiLineString';
import Feature from 'ol/Feature';
import {
  Style,
  Fill as FillStyle,
  Icon as IconStyle,
  Stroke as StrokeStyle,
  Circle as CircleStyle,
} from 'ol/style';
import { Point } from 'ol/geom';
import CasaLayer from '../CasaLayer';
import finishFlag from '../../img/finish_flag.svg';

/**
 * Layer for visualizing routes.
 *
 * <img src="img/layers/RouteLayer/layer.png" alt="Layer preview" title="Layer preview">
 * @class RouteLayer
 * @extends CasaLayer
 * @param {Object} [options] Layer options.
 *   Default is `{ rail: '#e3000b', bus: '#ffed00', ship: '#0074be' }`.
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
    super({
      name: 'RouteLayer',
      olLayer: new OLVectorLayer({
        className: 'RouteLayer', // needed for forEachLayerAtPixel
        style: (f) => this.routeStyle(f),
        source: new VectorSource(),
      }),
      ...options,
    });
    this.set('showPopupOnHover', (features = []) => {
      return features.filter((f) => f.get('route').popupContent);
    });
    this.set('popupComponent', 'CasaRoutePopup');

    this.featuresLayer = this.olLayer;

    this.url = 'https://api.geops.io/routing/v1/';

    this.selectedRouteIds = [];

    console.log(options.onClick, options);
    this.onClick((features) => {
      if (features.length) {
        const [feature] = features;
        const { isClickable, routeId } = feature.get('route');

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
    return !feature.get('route').popupContent;
  }

  /**
   * Default style function for the route layer.
   * @private
   */
  // eslint-disable-next-line class-methods-use-this
  defaultStyleFunction(feature, isSelected, isHovered) {
    const motColors = {
      rail: [235, 0, 0],
      bus: [255, 255, 0],
      funicular: [0, 151, 59],
      ship: [255, 255, 255],
    };

    const opacity = isSelected || isHovered ? 1 : 0.3;
    const rgb = motColors[feature.get('mot')] || [68, 68, 68];

    const style = {
      stroke: {
        color: [...rgb, opacity],
        width: 6,
      },
    };

    if (isHovered) {
      style.strokeOutline = {
        color: 'black',
        width: 8,
      };
    }

    return style;
  }

  /**
   * Getting the Mot-features on specific route.
   * @private
   * @param {Object} viaPoints Route Informations
   * @param {String} mot Ask for specific Route
   * @param {Object[]} sequenceProps Properties for the returned features.
   * @returns {array<ol.Feature>} Features
   */
  fetchRouteForMot(viaPoints, mot, sequenceProps) {
    this.abortController = new AbortController();

    const via = viaPoints.map((v) => `!${v}`);
    const urlParams = {
      key: this.apiKey || '',
      via: via.join('|'),
      mot,
    };

    const url = `${this.url}?${qs.stringify(urlParams)}`;
    const format = new GeoJSON({
      dataProjection: 'EPSG:4326',
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
        feature.setProperties(sequenceProps);
        return feature;
      });
  }

  /**
   * Returns the style of the given feature.
   * @private
   * @param {ol.feature} feature {@link https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html ol/Feature}
   * @returns {ol.style} get the feature's style function.
   */
  routeStyle(feature) {
    const { routeId } = feature.get('route');
    const isSelected = this.selectedRouteIds.includes(routeId);
    const isHovered =
      this.hoverFeature &&
      (this.hoverFeature.get('route') || {}).isClickable &&
      (this.hoverFeature.get('route') || {}).routeId === routeId;

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

      styleArray.push(RouteLayer.getCircleStyle(lineStart));
      styleArray.push(RouteLayer.getCircleStyle(lineEnd));
      styleArray.push(
        new Style({
          geometry: new Point(lineEnd),
          image: new IconStyle({
            src: finishFlag,
            anchor: [4.5, 3.5],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            anchorOrigin: 'bottom-left',
            imgSize: [24, 24],
          }),
          zIndex: 1,
        }),
      );
    }

    return styleArray;
  }

  /**
   * Load routes based on a given configuration.
   * @param {Object[]} routes Routes.
   * @param {boolean} routes[].isSelected If true, the route is
   *   selected initially.
   * @param {boolean} routes[].isClickable If true, the route can be
   *   selected or unselected by click.
   * @param {Object[]} routes[].sequences Route sequences.
   * @param {number} routes[].sequences[].uicFrom UIC number of start station.
   * @param {number} routes[].sequences[].uicTo UIC number of end station.
   * @param {string} routes[].sequences[].mot Method of transportation.
   *   Allowed values are "rail", "bus", "tram", "subway", "gondola",
   *   "funicular" and "ferry"
   * @returns {Promise<Feature[]>} Promise resolving OpenLayers features.
   */
  loadRoutes(routes) {
    const routePromises = [];

    for (let i = 0; i < routes.length; i += 1) {
      let via = [];

      if (!routes[i].sequences) {
        throw new Error('Missing route sequences.');
      }

      for (let j = 0; j < routes[i].sequences.length; j += 1) {
        const { mot, uicFrom, uicTo } = routes[i].sequences[j];
        const nextMot =
          j === routes[i].sequences.length - 1
            ? null
            : routes[i].sequences[j + 1].mot;

        via = via.concat([uicFrom, uicTo]);

        if (mot !== nextMot) {
          const sequenceProps = { route: { ...routes[i], routeId: i }, mot };
          routePromises.push(this.fetchRouteForMot(via, mot, sequenceProps));
          via = [];
        }
      }
    }

    return Promise.all(routePromises).then((data) => {
      const sequenceFeatures = data.flat().filter((f) => f);
      this.olLayer.getSource().addFeatures(sequenceFeatures);
      sequenceFeatures.forEach((f) => {
        const { routeId, isSelected } = f.get('route');
        if (isSelected) {
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
    this.map.getView().fit(this.olLayer.getSource().getExtent(), fitOptions);
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
