import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';
import { Feature } from 'ol';
import { MultiLineString } from 'ol/geom';
import { GeoJSON } from 'ol/format';
import { getLineColorExpr } from './lineColors';
import touristicLine from './touristischeLinie.json';
import hauptLinie from './hauptLinie.json';

const sourceId = 'ch.sbb.zweitausbildung';
const sourceLayer = 'ch.sbb.zweitausbildung';
const format = new GeoJSON();

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
    this.highlightLayerKey = zweitProps.highlightLayerKey;
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

    this.multiLinesLabels = [];
    this.multiLinesSources = {};
    this.multiLinesStyleLayers = [];
    this.updateTimeout = null;
    this.onIdle = this.onIdle.bind(this);
  }

  init(map) {
    super.init(map);

    this.olListenersKeys.push(
      this.on('change:visible', () => {
        this.updateMultiLinesSources();
      }),
      this.map.on('moveend', () => {
        this.mapboxLayer.mbMap.once('idle', this.onIdle);
      }),
    );
  }

  terminate(map) {
    window.clearTimeout(this.updateTimeout);
    const { mbMap } = this.mapboxLayer;
    if (mbMap) {
      mbMap.off('idle', this.onIdle);
      this.removeMultiLinesSources();
    }
    super.terminate(map);
  }

  /**
   * Callback when the map is on idle state after a moveend event.
   */
  onIdle() {
    window.clearTimeout(this.updateTimeout);
    this.updateTimeout = window.setTimeout(() => {
      this.updateMultiLinesSources();
    }, 100);
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
    this.addMultiLinesSources();
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
    this.updateMultiLinesSources();
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
        const values = data.tilestats.layers
          .find((layer) => layer.layer === sourceLayer)
          ?.attributes.find((attr) => attr.attribute === this.property)?.values;
        values.forEach((value) => {
          const split = value.split(',');
          if (split.length > 1) {
            this.multiLinesLabels.push(value);
          }
        });
        this.multiLinesSources = this.generateMultiLinesSources();
        this.multiLinesStyleLayers = this.generateMultiLinesStyleLayers();
      });
  }

  // Generate emtpy mapbox sources object for features with multiple lines.
  generateMultiLinesSources() {
    const sources = [];
    this.multiLinesLabels.forEach((line) => {
      sources[line] = {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      };
    });
    return sources;
  }

  // Generate dashed styles features with multiple lines.
  generateMultiLinesStyleLayers() {
    const styleLayers = [];
    this.multiLinesLabels.forEach((line) => {
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
          source: line,
          type: 'line',
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

  // Add sources for features with multiple lines.
  addMultiLinesSources() {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }

    Object.entries(this.multiLinesSources).forEach(([id, source]) => {
      if (!mbMap.getSource(id)) {
        mbMap.addSource(id, source);
      }
    });
  }

  // Remove source for features with multiple lines.
  removeMultiLinesSources() {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    Object.keys(this.multiLinesSources).forEach((id) => {
      if (mbMap.getSource(id)) {
        mbMap.removeSource(id);
      }
    });
  }

  // Update sources for features with multiple lines.
  updateMultiLinesSources() {
    if (
      !this.visible ||
      !this.multiLinesLabels ||
      !this.map ||
      !this.mapboxLayer.mbMap
    ) {
      return;
    }
    const { mbMap } = this.mapboxLayer;

    this.multiLinesLabels.forEach((line) => {
      const source = mbMap.getSource(line);
      if (!source) {
        return;
      }

      let features;
      try {
        features = mbMap.querySourceFeatures(sourceId, {
          sourceLayer,
          filter: ['==', ['get', this.property], line],
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        // console.error(e);
      }

      if (!features?.length) {
        return;
      }

      const ids = [];
      const nbCoord = [];
      const uniqueFeatures = [];
      features.forEach((linee) => {
        const indexOf = ids.indexOf(linee.id);
        if (indexOf === -1) {
          nbCoord.push(linee.geometry.coordinates.length);
          ids.push(linee.id);
          uniqueFeatures.push(linee);
        } else if (nbCoord[indexOf] < linee.geometry.coordinates.length) {
          uniqueFeatures[indexOf] = linee;
        }
      });

      const multiLine = new Feature(
        new MultiLineString(
          uniqueFeatures.map((lineString) => lineString.geometry.coordinates),
        ),
      );

      source.setData(format.writeFeaturesObject([multiLine]));
    });
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
