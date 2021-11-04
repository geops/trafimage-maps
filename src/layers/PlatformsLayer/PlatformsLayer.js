import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';

/**
 * Layer for displaying blue stations circle on hover.
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class PlatformsLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    const id = 'platforms';
    super({
      styleLayer: {
        id,
        type: 'circle',
        source: id,
        paint: {
          'circle-radius': 10,
          'circle-color': 'rgb(0, 61, 155)',
          'circle-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.5,
            0,
          ],
        },
        layout: {
          'symbol-placement': 'point',
        },
      },
      properties: {
        hideInLegend: true,
        popupComponent: 'NetzkartePopup',
      },
      ...options,
    });

    this.source = {
      id,
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    };

    this.onIdle = this.onIdle.bind(this);
  }

  /**
   * @override
   */
  init(map) {
    super.init(map);

    this.olListenersKeys.push(
      this.on('change:visible', () => {
        this.updateSource();
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
    const { mbMap } = this.mapboxLayer;
    if (mbMap) {
      mbMap.off('idle', this.onIdle);
      this.removeSource();
    }
    super.terminate(map);
  }

  /**
   * On Mapbox map load callback function. Add style sources then style layers.
   * @override
   */
  onLoad() {
    const { mbMap } = this.mapboxLayer;
    this.platformLayers = mbMap.getStyle().layers.filter((layer) => {
      return layer.type === 'symbol' && layer['source-layer'] === 'platform';
    });
    console.log(this.platformLayers);

    this.platformLayers = this.platformLayers.map((layer) => layer.id);

    this.addSource();
    super.onLoad();
    this.updateSource();
  }

  /**
   * Callback when the map is on idle state after a moveend event.
   */
  onIdle() {
    this.updateSource();
  }

  // Query the rendered stations then add them to the source.
  updateSource() {
    const { mbMap } = this.mapboxLayer;
    const source = mbMap.getSource(this.source.id);

    if (!this.platformLayers || !source) {
      return;
    }

    const pointsRendered = mbMap
      .queryRenderedFeatures({
        layers: this.platformLayers,
      })
      .map((feat) => {
        const good = {
          id: (feat.id || Math.random()) * 1000,
          type: feat.type,
          properties: feat.properties,
          geometry: feat.geometry,
        };
        return good;
      });

    source.setData({
      type: 'FeatureCollection',
      features: pointsRendered,
    });
  }

  // Add source for stations.
  addSource() {
    if (!this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;
    const { id } = this.source;
    if (!mbMap.getSource(id)) {
      const withoutId = { ...this.source };
      delete withoutId.id;
      mbMap.addSource(id, withoutId);
    }
  }

  // Remove source added by addSources().
  removeSource() {
    if (!this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;
    const { id } = this.source;
    if (mbMap.getSource(id)) {
      mbMap.removeSource(id);
    }
  }
}

export default PlatformsLayer;
