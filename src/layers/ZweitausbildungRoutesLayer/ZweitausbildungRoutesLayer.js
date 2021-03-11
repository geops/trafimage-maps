import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';
import { Feature } from 'ol';
import { MultiLineString } from 'ol/geom';
import { GeoJSON } from 'ol/format';
import { getLineColorExpr } from './lineColors';
import touristicLine from './touristischeLinie.json';
import hauptLinie from './hauptLinie.json';

const sourceId = 'base';
const sourceLayer = 'osm_edges';
const format = new GeoJSON();

/**
 * Layer for zweitausbildung routes
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/VectorLayer%20js~VectorLayer%20html}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class ZweitausbildungRoutesLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    // Very important that styleLayers is not empty otherwise the visibility is not apply properly.
    super(options);

    this.property = (this.get('zweitausbildung') || {}).property;
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
    this.multiLinesSources = [];
    this.multiLinesStyleLayers = [];
    this.updateTimeout = null;
    this.onIdle = this.onIdle.bind(this);
  }

  async init(map) {
    await fetch('https://maps.style-dev.geops.io/data/base_v3.json')
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
    super.init(map);

    this.olListenersKeys.push([
      this.on('change:visible', () => {
        if (this.visible) {
          this.updateMultiLinesSources();
        }
      }),
      this.map.on('moveend', () => {
        this.mapboxLayer.mbMap.once('idle', this.onIdle);
      }),
    ]);
  }

  terminate(map) {
    window.clearTimeout(this.updateTimeout);
    super.terminate(map);
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    mbMap.off('idle', this.onIdle);
    this.removeMultiLinesSources();
  }

  /**
   * Callback when the map is on idle state after a moveend event.
   */
  onIdle() {
    window.clearTimeout(this.updateTimeout);
    this.updateTimeout = window.setTimeout(() => {
      this.updateMultiLinesSources();
    }, 50);
  }

  /**
   * On Mapbox map load callback function. Add style sources then style layers.
   * @ignore
   */
  onLoad() {
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

  // Generate emtpy mapbox sources object for features with multiple lines.
  generateMultiLinesSources() {
    const sources = [];
    this.multiLinesLabels.forEach((line) => {
      const data = {
        type: 'FeatureCollection',
        features: [],
      };

      sources.push({
        id: line,
        type: 'geojson',
        // lineMetrics: true,
        data,
      });
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
          layout: {
            // 'line-cap': 'round',
            // 'line-join': 'round',
          },
        });
      });
    });
    return styleLayers;
  }

  // Add sources for features with multiple lines.
  addMultiLinesSources(sources) {
    if (!this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;
    (sources || this.multiLinesSources).forEach((source) => {
      const { id } = source;
      if (!mbMap.getSource(id)) {
        const withoutId = { ...source };
        delete withoutId.id;
        mbMap.addSource(id, withoutId);
      } else {
        mbMap.getSource(id).setData(source.data);
      }
    });
  }

  // Remove source for features with multiple lines.
  removeMultiLinesSources() {
    if (!this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;
    this.multiLinesSources.forEach(({ id }) => {
      if (mbMap.getSource(id)) {
        mbMap.removeSource(id);
      }
    });
  }

  // Upodate sources for features with multiple lines.
  updateMultiLinesSources() {
    if (!this.visible || !this.map || !this.mapboxLayer.mbMap) {
      return;
    }
    const sources = [];
    const { mbMap } = this.mapboxLayer;

    this.multiLinesLabels.forEach((line) => {
      // console.log(line);
      let features;
      try {
        features = mbMap.querySourceFeatures(sourceId, {
          sourceLayer,
          filter: ['all', ['==', ['get', this.property], line]],
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        // console.error(e);
      }
      if (!features?.length) {
        return;
      }
      // console.log(features);
      // console.log(
      //   (features || []).map((a) => {
      //     return {
      //       to_id: a.properties.to_id,
      //       from_id: a.properties.from_id,
      //       line_number: a.properties.line_number,
      //     };
      //   }),
      // );
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
        // if (linee.id === 67650) {
        //   console.log(linee.id);
        //   console.log(linee.properties);
        //   console.log(linee.geometry);
        // }
      });
      // features = uniqueFeatures;

      // console.log(features);
      const multiLine = new Feature(
        new MultiLineString(
          features.map((lineString) => lineString.geometry.coordinates),
        ),
      );
      const data = {
        type: 'FeatureCollection',
        features: [format.writeFeatureObject(multiLine)],
      };

      sources.push({
        id: line,
        type: 'geojson',
        // lineMetrics: true,
        data,
      });
    });
    this.addMultiLinesSources(sources);
  }
}

export default ZweitausbildungRoutesLayer;
