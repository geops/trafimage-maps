import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';
import colorsByLine from './lines.json';
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
  static getLineColorExpr = (property) => {
    const expr = ['case'];
    Object.entries(colorsByLine).forEach(([key, { color }]) => {
      expr.push(['==', ['get', property], key]);
      expr.push(color);
    });
    expr.push('rgba(0, 0, 0, 0)');
    return expr;
  };

  // Generate dashed styles for features with multiple lines in the label.
  static generateDashedStyleLayers(line, property) {
    const styleLayers = [];
    const linesLabels = line.split(',');
    linesLabels.forEach((label, index) => {
      const color = colorsByLine[label]?.color;
      if (!color) {
        // eslint-disable-next-line no-console
        console.log(
          `There is no color defined for ${label}, available labels are `,
          colorsByLine,
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
    const styleLayers = [
      // Lines with only one color.
      {
        id: options.name || options.key,
        type: 'line',
        source: sourceId,
        'source-layer': sourceLayer,
        filter: ['has', property],
        paint: {
          'line-color': ZweitausbildungRoutesLayer.getLineColorExpr(property),
          'line-width': 4,
        },
      },
      // Lines with a dashed style.
      ...ZweitausbildungRoutesLayer.getDashedStyleLayers(property),
    ];

    super({ ...options, styleLayers });
  }

  /**
   * On Mapbox map load callback function. Add the zweitausbildung data source then style layers.
   * @ignore
   */
  onLoad() {
    const { mbMap } = this.mapboxLayer;
    const source = mbMap.getSource(sourceId);
    if (!source) {
      mbMap.addSource(sourceId, {
        type: 'vector',
        url: this.dataUrl,
      });
    }
    super.onLoad();
  }

  setStyleConfig(url, key, apiKeyName) {
    if (url && url !== this.url) {
      this.url = url;
    }
    if (key && key !== this.apiKey) {
      this.apiKey = key;
    }
    if (apiKeyName && apiKeyName !== this.apiKeyName) {
      this.apiKeyName = apiKeyName;
    }
    if ((!url && !key && !apiKeyName) || !this.styleUrl) {
      this.dataUrl = `${this.url}/data/ch.sbb.zweitausbildung.json?${apiKeyName}=${key}`;
    }
  }
}

export default ZweitausbildungRoutesLayer;
