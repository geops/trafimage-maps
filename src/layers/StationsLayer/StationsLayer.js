import MapboxStyleLayer from "../MapboxStyleLayer";

/**
 * Layer for displaying blue stations circle on hover.
 * Extends {@link https://mobility-toolbox-js.geops.io/doc/class/build/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class StationsLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super({
      styleLayersFilter: ({ metadata }) =>
        !!metadata && metadata["trafimage.filter"] === "stations",
      properties: {
        hideInLegend: true,
        popupComponent: "StationPopup",
        useOverlay: true,
        isQueryable: true,
      },
      ...options,
    });

    this.sourceId = "stations";

    this.onIdle = this.onIdle.bind(this);
    this.ready = false;
  }

  /**
   * @override
   */
  attachToMap(map) {
    super.attachToMap(map);

    this.olListenersKeys.push(
      this.on("change:visible", () => {
        this.ready = false;
        this.updateSource();
      }),
      this.map.on("moveend", () => {
        this.ready = false;
        this.mapboxLayer.mbMap?.once("idle", this.onIdle);
      }),
    );
  }

  /**
   * @override
   */
  detachFromMap(map) {
    super.detachFromMap(map);
    const { mbMap } = this.mapboxLayer;
    if (mbMap) {
      mbMap.off("idle", this.onIdle);
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
      .layers.filter(
        ({ metadata }) =>
          metadata && /^stations/.test(metadata["general.filter"]),
      )
      .map((layer) => layer.id);

    this.addSource();
    super.onLoad();
    this.updateSource();
    mbMap.once("idle", this.onIdle);
  }

  /**
   * Callback when the map is on idle state after a moveend event.
   */
  onIdle() {
    this.updateSource();

    // We warn the permalink that new data have been rendered.
    this.mapboxLayer.mbMap?.once("idle", () => {
      this.ready = true;

      // New data are rendered
      this.dispatchEvent({
        type: "datarendered",
        target: this,
      });
    });
  }

  // Query the rendered stations then add them to the source.
  updateSource() {
    const { mbMap } = this.mapboxLayer;
    const source = mbMap?.getSource(this.sourceId);

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
      type: "FeatureCollection",
      features: osmPointsRendered,
    });
  }

  // Add source for stations.
  addSource() {
    if (!this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;
    if (!mbMap.getSource(this.sourceId)) {
      mbMap.addSource(this.sourceId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
    }
  }

  // Remove source added by addSources().
  removeSource() {
    if (!this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;
    const source = mbMap.getSource(this.sourceId);
    if (source) {
      // Don't remove source just make it empty.
      // Because others layers during unmount still could rely on it.
      source.setData({
        type: "FeatureCollection",
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

  clone(newOptions) {
    return new StationsLayer({ ...this.options, ...newOptions });
  }
}

export default StationsLayer;
