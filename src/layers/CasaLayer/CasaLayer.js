import deepmerge from 'deepmerge';
import {
  Style,
  Fill as FillStyle,
  Icon as IconStyle,
  Stroke as StrokeStyle,
  Text as TextStyle,
} from 'ol/style';
import { MultiLineString, LineString, Point } from 'ol/geom';
import { VectorLayer } from 'mobility-toolbox-js/ol';
import ArrowImg from '../../img/arrow.png';

/**
 * @typedef {Object} styleObject
 * @example {
 *   fill: { color: 'rgb(255, 200, 25)', },
 *   stroke: { width: 2, color: 'black' },
 *   strokeOutline: { width: 10, color: 'white' },
 *   text: { color: [255, 0, 0, 0.3] },
 *   textOutline: { color: 'white', width: 2 },
 * };
 * @property {Object} [fill] Fill properties.
 * @property {string|array} [fill.color] Fill color. (https://openlayers.org/en/latest/apidoc/module-ol_color.html#~Color)
 * @property {Object} [stroke] Stroke properties.
 * @property {number} [stroke.width] Stroke width.
 * @property {string|array} [stroke.color] Stroke color. (https://openlayers.org/en/latest/apidoc/module-ol_color.html#~Color)
 * @property {Object} [stroke.arrow] Stroke arrows.
 * @property {number} [stroke.arrow.count] Number of stroke arrows along the route.
 * @property {Object} [strokeOutline] Stroke outline.
 * @property {number} [strokeOutline.width] Stroke outline width.
 * @property {string|array} [strokeOutline.color] Stroke outline color. (https://openlayers.org/en/latest/apidoc/module-ol_color.html#~Color)
 * @property {Object} [text] Text properties.
 * @property {string} [text.font] Font.
 * @property {string} [text.label] Text label. If undefined, the zone code is used.
 * @property {string|array} [text.color] Text color. (https://openlayers.org/en/latest/apidoc/module-ol_color.html#~Color)
 * @property {Object} [textOutline] Text outline.
 * @property {string|array} [textOutline.color] Text outline color. (https://openlayers.org/en/latest/apidoc/module-ol_color.html#~Color)
 * @property {number} [textOutline.width] Text outline width.
 */

/**
 * @callback styleFunction
 * @param {Object} properties Feature properties.
 * @param {boolean} isSelected Whether the feature is selected.
 * @param {boolean} isHovered True if the feature is hovered.
 * @private
 * @returns {styleObject} The style object.
 */

/**
 * Generic layer used by RouteLayer and ZoneLayer.
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/VectorLayer%20js~VectorLayer%20html}
 * @class CasaLayer
 * @param {Object} options Layer options.
 * @param {function} onMouseOver Mouse over callback. Called with the feature and the coordinate.
 * @param {String} options.apiKey Access key for [geOps services](https://developer.geops.io/).
 * @param {String} options.apiKeyName Access key name for [geOps services](https://developer.geops.io/).
 * @param {styleFunction} [options.styleFunction] Style function.
 */
class CasaLayer extends VectorLayer {
  constructor(options = {}) {
    super(options);

    this.apiKey = options.apiKey;

    this.apiKeyName = options.apiKeyName;

    this.projection = options.projection || 'EPSG:3857';

    this.styleFunction = options.styleFunction || (() => ({}));

    this.mouseOverCallbacks = [];

    this.onMouseOver(options.onMouseOver);
  }

  /**
   * Overwrites the react-spatial function, necessary to change the target layer containing
   * the features, since olLayer is a LayerGroup in ZoneLayer
   */
  getFeatureInfoAtCoordinate(coordinate) {
    let features = [];

    if (this.map) {
      const pixel = this.map.getPixelFromCoordinate(coordinate);
      features = this.map
        .getFeaturesAtPixel(pixel, {
          layerFilter: (l) => l === this.featuresLayer,
          hitTolerance: this.hitTolerance,
        })
        .filter(
          (feature) =>
            feature.get('isClickable') ||
            (feature.get('route') && feature.get('route').isClickable),
        );
    }

    return Promise.resolve({
      features,
      layer: this,
      coordinate,
    });
  }

  /**
   * In some cases we want to dispatch an onClick() without showing a popup.
   * If this function returns true, no popup is displayed.
   * @param {ol.Feature} feature The potential popup feature.
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  hidePopup(feature) {
    // by default no popup is shown for CASA
    return true;
  }

  /**
   * Listen to mouseover events on features.
   * The callback is called with the hovered feature
   * (https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html)
   * and the coordinate.
   */
  onMouseOver(callback) {
    if (callback && typeof callback === 'function') {
      this.mouseOverCallbacks.push(callback);
    }
  }

  /**
   * The layer's default style function.
   * @private
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  defaultStyleFunction(feature, isSelected, isHovered) {
    // to be implemented by inheriting layers
    return {};
  }

  /**
   * Converts a zone style to an Object of ol.Style.
   * @private
   * @param {styleObject} [styleObject = {}] Style object.
   * @param {number} resolution Map resultion.
   * @param {boolean} [isSelected = false] Whether the feature is selected.
   * @param {boolean} [isHovered= false] True if the feature is hovered.
   */
  getOlStylesFromObject(
    styleObject = {},
    isSelected = false,
    isHovered = false,
    feature,
  ) {
    const geom = feature && feature.getGeometry();
    const defaultStyleObject = this.defaultStyleFunction(
      feature,
      isSelected,
      isHovered,
    );

    const style = deepmerge(defaultStyleObject, styleObject, {
      arrayMerge: (a, b) => b, // do not merge arrays
    });

    const olStyles = {};
    if (style.hoverStyles) {
      Object.keys(style.hoverStyles).forEach((key) => {
        olStyles[key] = new Style({
          stroke: new StrokeStyle({
            ...style.hoverStyles[key],
          }),
        });
      });
    }

    olStyles.base = new Style({
      stroke: style.stroke ? new StrokeStyle({ ...style.stroke }) : undefined,
      fill: style.fill ? new FillStyle({ ...style.fill }) : undefined,
    });

    if (
      style.strokeArrow &&
      (geom instanceof LineString || geom instanceof MultiLineString)
    ) {
      olStyles.arrows = [];
      olStyles.helpPoints = [];
      const { count, color } = style.strokeArrow;
      const fraction = 1 / (count - 1);
      const rotationFractionDiff = 0.05;

      const arrowColor = color || (style.stroke || {}).color;
      const opacity =
        Array.isArray(arrowColor) && arrowColor.length === 4
          ? arrowColor[3]
          : 1;

      // fraction offset for measuring the rotation
      let currentFraction = 0;

      while (currentFraction <= 1) {
        const coords = geom.getCoordinateAt(currentFraction);
        let rotation = 0;

        if (currentFraction + rotationFractionDiff < 1) {
          const rotFraction = currentFraction + rotationFractionDiff;
          const rotCoords = geom.getCoordinateAt(rotFraction);

          rotation = Math.atan2(
            rotCoords[1] - coords[1],
            rotCoords[0] - coords[0],
          );
        } else {
          const rotFraction = currentFraction - rotationFractionDiff;
          const rotCoords = geom.getCoordinateAt(rotFraction);

          rotation =
            Math.PI +
            Math.atan2(rotCoords[1] - coords[1], rotCoords[0] - coords[0]);
        }

        rotation = 2 * Math.PI - rotation;

        olStyles.arrows.push(
          new Style({
            geometry: new Point(coords),
            image: new IconStyle({
              rotation,
              src: ArrowImg,
              color: arrowColor,
              opacity,
            }),
          }),
        );

        currentFraction += fraction;
      }
    }

    if (style.text) {
      olStyles.text = new Style({
        text: new TextStyle({
          font: style.text.font || 'bold 13px Arial',
          fill: new FillStyle({
            color: style.text.color,
          }),
          stroke: style.textOutline
            ? new StrokeStyle({ ...style.textOutline })
            : undefined,
          text: style.text.label,
        }),
      });
    }

    if (isSelected) {
      Object.values(olStyles)
        .flat()
        .forEach((s) => s.setZIndex(0.5));
    }

    if (isHovered) {
      Object.values(olStyles)
        .flat()
        .forEach((s) => s.setZIndex(1));
    }

    return olStyles;
  }

  /**
   * Override the callClickCallbacks function of mobility-toolbox-js's Vectorlayer
   * in order to stop the propagation if the first feature is from another layer.
   * @private
   * @inheritdoc
   */
  callClickCallbacks(features, layer, coordinate) {
    const pixel = this.map.getPixelFromCoordinate(coordinate);
    const topLayer = this.map.forEachLayerAtPixel(pixel, (l, rgba) => {
      // this check is required for IE11 support
      if (rgba.length === 0) {
        return false;
      }
      return l;
    });

    if (layer.featuresLayer !== topLayer) {
      return;
    }

    super.callClickCallbacks(features, layer, coordinate);
  }

  /**
   * Set the hoverFeature when hovering a feature.
   * @private
   */
  attachToMap(map) {
    super.attachToMap(map);
    this.map.on('pointermove', (e) => {
      const feature = this.map.forEachFeatureAtPixel(e.pixel, (f) => f);
      if (feature !== this.hoverFeature) {
        this.hoverFeature = feature;
        if (this.featuresLayer) {
          this.featuresLayer.changed();
          if (this.labelsLayer) {
            this.labelsLayer.changed();
          }
        } else {
          this.olLayer.changed();
        }
        this.mouseOverCallbacks.forEach((c) => c(feature, e.coordinate));
      }
    });
  }
}

export default CasaLayer;
