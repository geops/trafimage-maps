import deepmerge from 'deepmerge';
import {
  Style,
  Fill as FillStyle,
  Stroke as StrokeStyle,
  Text as TextStyle,
} from 'ol/style';
import VectorLayer from 'react-spatial/layers/VectorLayer';

/**
 * @typedef {Object} styleObject
 * @example {
 *   fill: { color: 'rgb(255, 200, 25)', },
 *   stroke: { width: 2, color: 'black' },
 *   strokeOutline: { width: 10, color: 'white' },
 *   text: { color: 'black' },
 *   textOutline { color: 'white', width: 2 },
 * };
 * @property {Object} [fill] Fill properties.
 * @property {string} [fill.color] Fill color.
 * @property {Object} [stroke] Stroke properties.
 * @property {number} [stroke.width] Stroke width.
 * @property {string} [stroke.color] Stroke color.
 * @property {Object} [strokeOutline] Stroke outline.
 * @property {number} [strokeOutline.width] Stroke outline width.
 * @property {string} [strokeOutline.color] Stroke outline color.
 * @property {Object} [text] Text properties.
 * @property {string} [text.font] Font.
 * @property {string} [text.label] Text label. If undefined, the zone code is used.
 * @property {string} [text.color] Text color.
 * @property {Object} [textOutline] Text outline.
 * @property {string} [textOutline.color] Text outline color.
 * @property {number} [textOutline.width] Text outline width.
 */

/**
 * @callback styleFunction
 * @param {Object} properties Feature properties.
 * @param {boolean} isSelected Whether the feature is selected.
 * @param {boolean} isHovered True if the feature is hovered.
 * @returns {styleObject} The style object.
 */

/**
 * Generic layer used by RouteLayer and ZoneLayer.
 * Extends {@link https://react-spatial.geops.de/docjs.html#vectorlayer react-spatial/layers/VectorLayer}
 * @class CasaLayer
 * @param {Object} options Layer options.
 * @param {function} onMouseOver Mouse over callback. Called with the feature and the coordinate.
 * @param {String} options.apiKey Access key for [geOps services](https://developer.geops.io/).
 * @param {styleFunction} [options.styleFunction] Style function.
 */
class CasaLayer extends VectorLayer {
  constructor(options = {}) {
    super(options);

    this.apiKey = options.apiKey;

    this.projection = options.projection || 'EPSG:3857';

    this.styleFunction = options.styleFunction || (() => ({}));

    this.mouseOverCallbacks = [];

    this.onMouseOver(options.onMouseOver);
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
    const defaultStyleObject = this.defaultStyleFunction(
      feature,
      isSelected,
      isHovered,
    );

    const style = deepmerge(defaultStyleObject, styleObject, {
      arrayMerge: (a, b) => b, // do not merge arrays
    });

    const olStyles = {};

    if (style.strokeOutline) {
      olStyles.outline = new Style({
        stroke: new StrokeStyle({
          ...style.strokeOutline,
        }),
      });
    }

    olStyles.base = new Style({
      stroke: style.stroke ? new StrokeStyle({ ...style.stroke }) : undefined,
      fill: style.fill ? new FillStyle({ ...style.fill }) : undefined,
    });

    if (style.text) {
      olStyles.text = new Style({
        text: new TextStyle({
          font: style.text.font || 'bold 13px Arial',
          fill: new FillStyle({
            color: style.text.color,
          }),
          stroke: style.text.textOutline
            ? new StrokeStyle({ ...style.textOutline })
            : undefined,
          text: style.text.label,
        }),
      });
    }

    if (isSelected || isHovered) {
      Object.values(olStyles).forEach(s => s.setZIndex(1));
    }

    return olStyles;
  }

  /**
   * Override the callClickCallbacks function of react-spatial's Vectorlayer
   * in order to stop the propagation if the first feature is from another layer.
   * @private
   * @inheritdoc
   */
  callClickCallbacks(features, layer, coordinate) {
    const pixel = this.map.getPixelFromCoordinate(coordinate);
    const isTopFeature = this.map.hasFeatureAtPixel(pixel, {
      layerFilter: l => l === this.olLayer,
    });
    if (!isTopFeature) {
      return;
    }

    super.callClickCallbacks(features, layer, coordinate);
  }

  /**
   * Set the hoverFeature when hovering a feature.
   * @private
   */
  init(map) {
    super.init(map);

    this.map.on('pointermove', e => {
      const feature = this.map.forEachFeatureAtPixel(e.pixel, f => f);
      if (feature !== this.hoverFeature) {
        this.hoverFeature = feature;
        this.olLayer.changed();
        this.mouseOverCallbacks.forEach(c => c(feature, e.coordinate));
      }
    });
  }
}

export default CasaLayer;
