import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';

/**
 * Layer for displaying blue stations circle on hover.
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class StationsLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super({
      styleLayer: {
        id: 'stations',
        type: 'circle',
        source: 'stations',
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
      },
      properties: {
        hideInLegend: true,
        popupComponent: 'StationPopup',
        useOverlay: true,
      },
      ...options,
    });

    this.source = {
      id: 'stations',
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
    super.terminate(map);
    const { mbMap } = this.mapboxLayer;
    if (mbMap) {
      mbMap.off('idle', this.onIdle);
      this.removeSource();
    }
  }

  /**
   * On Mapbox map load callback function. Add style sources then style layers.
   * @override
   */
  onLoad() {
    const { mbMap } = this.mapboxLayer;
    this.osmPointsLayers = mbMap
      .getStyle()
      .layers.filter((layer) => {
        return (
          (layer['source-layer'] === 'osm_points' &&
            layer.id !== 'osm_points') ||
          (layer['source-layer'] === 'poi' && /^station_ship/.test(layer.id))
        );
      })
      .map((layer) => layer.id);

    this.addSource();
    super.onLoad();
    this.updateSource();
  }

  /**
   * Callback when the map is on idle state after a moveend event.
   */
  onIdle() {
    this.updateSource();

    // We warn the permalink that new data have been rendered.
    this.mapboxLayer.mbMap?.once('idle', () => {
      // New data are rendered
      this.dispatchEvent({
        type: 'datarendered',
        target: this,
      });
    });
  }

  // Query the rendered stations then add them to the source.
  updateSource() {
    const { mbMap } = this.mapboxLayer;
    const source = mbMap?.getSource(this.source.id);

    if (!this.osmPointsLayers || !source) {
      return;
    }

    const osmPointsRendered = mbMap
      .queryRenderedFeatures({
        layers: this.osmPointsLayers,
      })
      .map((feat) => {
        const good = {
          id: feat.id * 1000,
          type: feat.type,
          properties: feat.properties,
          geometry: feat.geometry,
        };
        return good;
      });

    source.setData({
      type: 'FeatureCollection',
      features: osmPointsRendered,
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
    const source = mbMap.getSource(id);
    if (source) {
      // Don't remove source just make it empty.
      // Because others layers during unmount still could rely on it.
      source.setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  // Deactivate select style.
  select() {
    this.setHoverState(this.highlightedFeatures, false);
    this.setHoverState(this.selectedFeatures, false);
  }
}

export default StationsLayer;
