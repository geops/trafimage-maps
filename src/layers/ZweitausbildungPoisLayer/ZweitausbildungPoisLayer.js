import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';
import { GeoJSON } from 'ol/format';

/**
 * Layer for zweitausbildung pois
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class ZweitausbildungPoisLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    const { color, icon, filter } = options.properties.zweitausbildung;
    const suffixId = filter[1] + filter[2];
    const clusterSourceId = `clusters-${suffixId}`;
    const highlightSourceId = 'highlight';
    const styleLayers = [
      {
        id: clusterSourceId,
        type: 'circle',
        source: clusterSourceId,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': color,
          'circle-radius': [
            '*',
            9,
            ['sqrt', ['/', ['+', ['get', 'point_count'], 15], ['pi']]],
          ],
        },
      },
      {
        id: `${clusterSourceId}-count`,
        type: 'symbol',
        source: clusterSourceId,
        filter: ['has', 'point_count'],
        paint: {
          'text-color': 'rgba(255,255,255,1)',
        },
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Arial Unicode MS Bold'],
          'text-size': 14,
        },
      },
      {
        id: `unclustered-point-${suffixId}`,
        type: 'symbol',
        source: clusterSourceId,
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': icon,
        },
      },
      {
        id: highlightSourceId,
        source: highlightSourceId,
        type: 'circle',
        paint: {
          'circle-color': 'rgba(50, 50, 50, 0.8)',
          'circle-radius': 0,
          'circle-radius-transition': {
            duration: 300,
            delay: 0,
          },
        },
      },
    ];
    super({
      ...options,
      styleLayers,
      queryRenderedLayersFilter: ({ id }) =>
        `unclustered-point-${suffixId}` === id || clusterSourceId === id,
    });

    this.clusterSource = {
      id: clusterSourceId,
      type: 'geojson',
      cluster: true,
      clusterRadius: 75, // Radius of each cluster when clustering points.
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    };
    this.highlightSource = {
      id: highlightSourceId,
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    };
    this.sources = [this.clusterSource, this.highlightSource];
    this.filter = filter;
    this.updateTimeout = null;
    this.format = new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });
    this.onIdle = this.onIdle.bind(this);
  }

  /**
   * @override
   */
  init(map) {
    super.init(map);

    this.olListenersKeys.push(
      this.on('change:visible', () => {
        this.updateClusterSource();
      }),
      this.map.on('moveend', () => {
        this.mapboxLayer.mbMap?.once('idle', this.onIdle);
      }),
    );
  }

  /**
   * @override
   */
  terminate(map) {
    window.clearTimeout(this.updateTimeout);
    const { mbMap } = this.mapboxLayer;
    if (mbMap) {
      mbMap.off('idle', this.onIdle);
      this.removeSources();
    }
    super.terminate(map);
  }

  /**
   * On Mapbox map load callback function. Add style sources then style layers.
   * @override
   */
  onLoad() {
    this.addSources();
    super.onLoad();
    this.updateClusterSource();
  }

  /**
   * Callback when the map is on idle state after a moveend event.
   */
  onIdle() {
    window.clearTimeout(this.updateTimeout);
    this.updateTimeout = window.setTimeout(() => {
      this.updateClusterSource();
    }, 50);
  }

  // Add sources for features using clustering and for highligting.
  addSources() {
    if (!this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;

    this.sources.forEach((source) => {
      const { id } = source;
      if (!mbMap.getSource(id)) {
        const withoutId = { ...source };
        delete withoutId.id;
        mbMap.addSource(id, withoutId);
      }
    });
  }

  // Remove sources added by addSources().
  removeSources() {
    if (!this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;
    this.sources.forEach((source) => {
      const { id } = source;
      const sourcee = mbMap.getSource(id);
      if (sourcee) {
        // Don't remove source just make it empty.
        // Because others layers during unmount still could rely on it.
        sourcee.setData({
          type: 'FeatureCollection',
          features: [],
        });
      }
    });
  }

  // Upodate sources for features with multiple lines.
  updateClusterSource() {
    if (!this.visible || !this.map || !this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;
    const source = mbMap.getSource(this.clusterSource.id);
    if (!source) {
      return;
    }

    let features;
    try {
      features = mbMap.querySourceFeatures('ch.sbb.zweitausbildung_pois', {
        sourceLayer: 'ch.sbb.zweitausbildung_pois',
        filter: this.filter,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      // console.error(e);
    }

    if (!features?.length) {
      return;
    }

    // Remove duplicated features.
    const ids = [];
    const uniqueFeatures = [];
    features.forEach((linee) => {
      const indexOf = ids.indexOf(linee.id);
      if (indexOf === -1) {
        ids.push(linee.id);
        uniqueFeatures.push(linee);
      }
    });

    source.setData({
      type: 'FeatureCollection',
      features: uniqueFeatures,
    });
  }

  highlightFromPopup(feature, toggle) {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }

    const data = this.format.writeFeaturesObject(toggle ? [feature] : []);
    const source = mbMap.getSource(this.highlightSource.id);
    if (source) {
      source.setData(data);
    }

    // Launch animation
    mbMap.setPaintProperty(
      this.highlightSource.id,
      'circle-radius',
      toggle ? 14 : 0,
    );
  }
}

export default ZweitausbildungPoisLayer;
