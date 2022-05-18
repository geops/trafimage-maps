import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';

/**
 * Layer for displaying blue circle on platforms on hover.
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class PlatformsLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    const id = 'platforms';
    // const paint = {
    //   'icon-opacity': [
    //     'case',
    //     ['boolean', ['feature-state', 'hover'], false],
    //     0.5,
    //     0,
    //   ],
    // };
    // const layout = {
    //   'icon-image': '111_circle-blue-big-01',
    //   'icon-ignore-placement': true,
    //   'icon-allow-overlap': true,
    // };
    super({
      styleLayersFilter: ({ metadata }) =>
        !!metadata && metadata['trafimage.filter'] === 'platforms',
      // styleLayers: [
      //   // Icons are not well placed on platform polygons because we don't
      //   // have the exact same polygon as mapbox. So we can't use the new
      //   // source to display the icons, we have to use the original source
      //   // and set a filter (using uid) to the layer to display only rendered
      //   // plaforms polygons.
      //   {
      //     id: `${id}_polygon`,
      //     type: 'symbol',
      //     source: 'openmaptiles',
      //     'source-layer': 'platform',
      //     filter: ['all', false],
      //     paint,
      //     layout,
      //   },
      //   {
      //     id: `${id}_linestring`,
      //     type: 'symbol',
      //     source: id,
      //     filter: ['==', ['geometry-type'], 'LineString'],
      //     paint,
      //     layout: {
      //       ...layout,
      //       'symbol-placement': 'line-center',
      //     },
      //   },
      //   {
      //     id: `${id}_point`,
      //     type: 'symbol',
      //     source: id,
      //     filter: ['==', ['geometry-type'], 'Point'],
      //     paint,
      //     layout,
      //   },
      // ],
      properties: {
        hideInLegend: true,
        popupComponent: 'StationPopup',
        useOverlay: true,
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

    this.platformLayers = this.platformLayers.map((layer) => layer.id);

    this.addSource();
    super.onLoad();
    this.updateSource();
    mbMap.once('idle', this.onIdle);
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
    const uids = []; // ['==', 'uid', '496211a5d7ec6962'];
    const pointsRendered = mbMap
      .queryRenderedFeatures({
        layers: this.platformLayers,
      })
      .map((feat) => {
        const { geometry } = feat;

        if (geometry.type === 'Polygon') {
          // if it's a polygon we store the uid for the filter.
          uids.push(feat.properties.uid);
        }

        const good = {
          id: (feat.id || Math.random()) * 1000,
          type: feat.type,
          properties: feat.properties,
          geometry,
        };
        return good;
      });

    // we display only visible platorm polygons
    mbMap.setFilter('platforms_polygon_highlight', [
      'all',
      ['==', ['geometry-type'], 'Polygon'],
      ['in', ['get', 'uid'], ['literal', uids]],
    ]);
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
}

export default PlatformsLayer;
