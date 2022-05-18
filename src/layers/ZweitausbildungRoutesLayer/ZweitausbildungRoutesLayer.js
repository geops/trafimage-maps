import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';
import lines from './lines';
import zweitTilestats from './zweitausbildung_tilestats.json';

const sourceId = 'ch.sbb.zweitausbildung';
const sourceLayer = 'ch.sbb.zweitausbildung';

/**
 * Layer for zweitausbildung routes
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class ZweitausbildungRoutesLayer extends MapboxStyleLayer {
  // Get mapbox line-color expression.
  static getLineColorExpr = (lineProperty) => {
    const expr = ['case'];
    Object.entries(lines).forEach(([key, { property, color }]) => {
      if (property === lineProperty) {
        expr.push(['==', ['get', property], key]);
        expr.push(color);
      }
    });
    expr.push('rgba(0, 0, 0, 0)');
    return expr;
  };

  // Generate dashed styles for features with multiple lines in the label.
  static generateDashedStyleLayers(line, property) {
    const styleLayers = [];
    const linesLabels = line.split(',');
    linesLabels.forEach((label, index) => {
      const color = lines[label]?.color;
      if (!color) {
        // eslint-disable-next-line no-console
        console.log(
          `There is no color defined for ${label}, available labels are `,
          lines,
        );
        return;
      }
      styleLayers.push({
        id: `${line}${index}`,
        source: sourceId,
        'source-layer': sourceLayer,
        type: 'line',
        filter: ['==', line, ['get', property]],
        paint: {
          'line-color': color,
          'line-width': 4,
          'line-dasharray': [(linesLabels.length - index) * 2, index * 2],
        },
      });
    });
    return styleLayers;
  }

  /**
   * Load the tilestats data to get all the possible values for hauptlinie or touristische_linie property.
   */
  static getDashedStyleLayers(property) {
    const styleLayers = [];
    const values = zweitTilestats.tilestats.layers
      .find((layer) => layer.layer === sourceLayer)
      ?.attributes.find((attr) => attr.attribute === property)?.values;
    values.forEach((value) => {
      const split = value.split(',');
      if (split.length > 1) {
        styleLayers.push(
          ...ZweitausbildungRoutesLayer.generateDashedStyleLayers(
            value,
            property,
          ),
        );
      }
    });
    return styleLayers;
  }

  constructor(options = {}) {
    const { property } = options.properties.zweitausbildung || {};
    const defautStyle = {
      type: 'line',
      filter: ['has', property],
      paint: {
        'line-color': ZweitausbildungRoutesLayer.getLineColorExpr(property),
        'line-width': 4,
      },
      layout: {
        'line-cap': 'round',
      },
    };
    const styleLayers = [
      // Lines with only one color.
      {
        ...defautStyle,
        id: options.name || options.key,
        source: sourceId,
        'source-layer': sourceLayer,
      },
      // Lines with a dashed style.
      ...ZweitausbildungRoutesLayer.getDashedStyleLayers(property),
    ];

    // if a line has others sources to add, we add the corresponding style layer.
    Object.values(lines).forEach(
      ({ property: prop, extraSources, extraStyleLayers = [] }) => {
        if (prop !== property || !extraSources) {
          return;
        }
        Object.keys(extraSources).forEach((key, index) => {
          styleLayers.push({
            ...defautStyle,
            id: key,
            source: key,
            ...(extraStyleLayers[index] || {}),
          });
        });
      },
    );

    super({
      ...options,
      styleLayers,
      beforeId: 'ch.sbb.zweitausbildung_pois.railaway',
    });
    this.property = property;
  }

  /**
   * On Mapbox map load callback function. Add the zweitausbildung data source then style layers.
   * @ignore
   */
  onLoad() {
    const { mbMap } = this.mapboxLayer;

    // if the selected lines as extra sources we add it now.
    Object.entries(lines).forEach(([key, { property, extraSources }]) => {
      if (property !== this.property || !extraSources) {
        return;
      }

      Object.entries(extraSources).forEach(([sourceKey, sourceToAdd]) => {
        if (!mbMap.getSource(sourceKey)) {
          // First we add a property to the features so the lines will be automatically highlighted.
          sourceToAdd.data.features.forEach((feat) => {
            // eslint-disable-next-line no-param-reassign
            feat.properties[this.property] = key;
          });
          mbMap.addSource(sourceKey, sourceToAdd);
        }
      });
    });
    super.onLoad();
  }
}

export default ZweitausbildungRoutesLayer;
