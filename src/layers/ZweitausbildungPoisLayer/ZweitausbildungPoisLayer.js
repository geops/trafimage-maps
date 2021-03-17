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
    const styleLayers = [
      // {
      //   id: `highlight-${suffixId}`,
      //   source: 'ch.sbb.zweitausbildung_pois',
      //   'source-layer': 'ch.sbb.zweitausbildung_pois',
      //   type: 'circle',
      //   filter,
      //   paint: {
      //     'circle-color': [
      //       'case',
      //       ['boolean', ['feature-state', 'hover'], false],
      //       'red',
      //       'blue',
      //     ],
      //     'circle-radius': [
      //       'case',
      //       ['boolean', ['feature-state', 'hover'], false],
      //       5,
      //       15,
      //     ],
      //   },
      // },

      {
        id: `clusters-${suffixId}`,
        type: 'circle',
        source: `clusters-${suffixId}`,
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
        id: `cluster-count-${suffixId}`,
        type: 'symbol',
        source: `clusters-${suffixId}`,
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
        source: `clusters-${suffixId}`,
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': icon,
        },
      },
    ];
    // Very important that styleLayers is not empty otherwise the visibility is not apply properly.
    super({
      ...options,
      styleLayers,
      queryRenderedLayersFilter: ({ id }) =>
        `unclustered-point-${suffixId}` === id || `clusters-${suffixId}` === id,
    });

    this.clusterSource = {
      id: `clusters-${suffixId}`,
      type: 'geojson',
      cluster: true,
      clusterRadius: 75, // Radius of each cluster when clustering points.
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    };
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
        this.mapboxLayer.mbMap.once('idle', this.onIdle);
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
      this.removeClusterSource();

      if (mbMap.getSource('highlight')) {
        mbMap.removeSource('highlight');
      }
    }
    super.terminate(map);
  }

  /**
   * On Mapbox map load callback function. Add style sources then style layers.
   * @override
   */
  onLoad() {
    this.addClusterSource();
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

  // Add sources for features using clustering.
  addClusterSource(source) {
    if (!this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;

    const sourceToAdd = source || this.clusterSource;
    const { id } = sourceToAdd;
    if (!mbMap.getSource(id)) {
      const withoutId = { ...sourceToAdd };
      delete withoutId.id;
      mbMap.addSource(id, withoutId);
    } else {
      mbMap.getSource(id).setData(sourceToAdd.data);
    }
  }

  // Remove source for features with multiple lines.
  removeClusterSource() {
    if (!this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;
    const { id } = this.clusterSource;
    if (mbMap.getSource(id)) {
      mbMap.removeSource(id);
    }
  }

  // Upodate sources for features with multiple lines.
  updateClusterSource() {
    if (!this.visible || !this.map || !this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;

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
    const ids = [];
    const uniqueFeatures = [];
    features.forEach((linee) => {
      const indexOf = ids.indexOf(linee.id);
      if (indexOf === -1) {
        ids.push(linee.id);
        uniqueFeatures.push(linee);
      }
    });
    features = uniqueFeatures;

    const data = {
      type: 'FeatureCollection',
      features,
    };

    this.addClusterSource({
      id: this.clusterSource.id,
      type: 'geojson',
      data,
    });
  }

  highlightFromPopup(feature, toggle) {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }

    const data = this.format.writeFeaturesObject(toggle ? [feature] : []);
    const source = mbMap.getSource('highlight');
    if (mbMap.getSource('highlight')) {
      source.setData(data);
    } else {
      mbMap.addLayer({
        id: `highlight`,
        source: {
          type: 'geojson',
          data,
        },
        type: 'circle',
        paint: {
          'circle-color': 'rgba(50, 50, 50, 0.8)',
          'circle-radius': 0,
          'circle-radius-transition': {
            duration: 300,
            delay: 0,
          },
        },
      });
    }

    // Launch animation
    mbMap.setPaintProperty(`highlight`, 'circle-radius', toggle ? 14 : 0);
  }
}

export default ZweitausbildungPoisLayer;
