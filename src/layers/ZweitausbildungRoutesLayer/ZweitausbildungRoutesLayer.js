import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';
import { getLineColorExpr } from './lineColors';
import touristicLine from './touristischeLinie.json';
import hauptLinie from './hauptLinie.json';

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
  constructor(options = {}) {
    super(options);

    const zweitProps = this.get('zweitausbildung') || {};
    this.property = zweitProps.property;
    this.lines = this.property === 'hauptlinie' ? hauptLinie : touristicLine;

    this.singleLineStyleLayer = {
      id: options.name || options.key,
      type: 'line',
      source: sourceId,
      'source-layer': sourceLayer,
      filter: ['has', this.property],
      paint: {
        'line-color': getLineColorExpr(this.property),
        'line-width': 4,
      },
    };

    this.multiLinesStyleLayers = [];
  }

  /**
   * On Mapbox map load callback function. Add style sources then style layers.
   * @ignore
   */
  async onLoad() {
    const { mbMap } = this.mapboxLayer;
    const source = mbMap.getSource(sourceId);
    if (!source) {
      mbMap.addSource(sourceId, {
        type: 'vector',
        url: this.dataUrl,
      });
    }
    await this.loadSourceData();
    this.styleLayers = [
      this.singleLineStyleLayer,
      ...this.multiLinesStyleLayers,
    ];
    // We must also reset the default filterFunc to be sure the visibility is set properly
    const ids = this.styleLayers.map((s) => s.id);
    this.styleLayersFilter = (styleLayer) => {
      return ids.includes(styleLayer.id);
    };

    super.onLoad();
  }

  /**
   * Load the source data to get all the possible values for hauptlinie
   * or touristische_linie property.
   */
  async loadSourceData() {
    const source = this.mapboxLayer.mbMap.getSource(sourceId);
    await fetch(source.url)
      .then((data) => data.json())
      .then((data) => {
        const multiLinesLabels = [];
        const values = data.tilestats.layers
          .find((layer) => layer.layer === sourceLayer)
          ?.attributes.find((attr) => attr.attribute === this.property)?.values;
        values.forEach((value) => {
          const split = value.split(',');
          if (split.length > 1) {
            multiLinesLabels.push(value);
          }
        });
        this.multiLinesStyleLayers = this.generateMultiLinesStyleLayers(
          multiLinesLabels,
        );
      });
  }

  // Generate dashed styles for features with multiple lines.
  generateMultiLinesStyleLayers(multiLinesLabels) {
    const styleLayers = [];
    multiLinesLabels.forEach((line) => {
      const linesLabels = line.split(',');
      linesLabels.forEach((label, index) => {
        const color = this.lines[label]?.color;
        if (!color) {
          // eslint-disable-next-line no-console
          console.log(
            `There is no color defined for ${label}, available labels are `,
            this.lines,
          );
          return;
        }
        styleLayers.push({
          id: `${line}${index}`,
          source: sourceId,
          'source-layer': sourceLayer,
          type: 'line',
          filter: ['==', line, ['get', this.property]],
          paint: {
            'line-color': color,
            'line-width': 4,
            'line-dasharray': [(linesLabels.length - index) * 2, index * 2],
          },
        });
      });
    });
    return styleLayers;
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
