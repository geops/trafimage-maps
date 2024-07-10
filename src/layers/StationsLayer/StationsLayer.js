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

    this.olEventsKeys.push(
      this.on("change:visible", () => {
        this.ready = false;
        this.updateSource();
      }),
      this.map.on("moveend", () => {
        this.ready = false;
        this.mapboxLayer.maplibreMap?.once("idle", this.onIdle);
      }),
    );
  }

  /**
   * @override
   */
  detachFromMap(map) {
    const { maplibreMap } = this.mapboxLayer;
    if (maplibreMap) {
      maplibreMap.off("idle", this.onIdle);
      this.removeSource();
    }
    super.detachFromMap(map);
  }

  /**
   * On Mapbox map load callback function. Add style sources then style layers.
   * @override
   */
  onLoad() {
    const { maplibreMap } = this.mapboxLayer;

    this.osmPointsLayers = maplibreMap
      .getStyle()
      .layers.filter(
        ({ metadata }) =>
          metadata && /^stations/.test(metadata["general.filter"]),
      )
      .map((layer) => layer.id);

    if (!this.osmPointsLayers?.length) {
      // eslint-disable-next-line no-console
      console.warn(
        'No metadata general.filter="stations" in this style:',
        maplibreMap?.getStyle()?.name,
      );
      this.set("disabled", true);
    }

    this.addSource();
    super.onLoad();
    this.updateSource();
    maplibreMap.once("idle", this.onIdle);
  }

  /**
   * Callback when the map is on idle state after a moveend event.
   */
  onIdle() {
    this.updateSource();

    // We warn the permalink that new data have been rendered.
    this.mapboxLayer.maplibreMap?.once("idle", () => {
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
    const { maplibreMap } = this.mapboxLayer;
    const source = maplibreMap?.getSource(this.sourceId);

    if (!this.osmPointsLayers || !source) {
      return;
    }

    const osmPointsRendered = maplibreMap
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
    if (!this.mapboxLayer.maplibreMap) {
      return;
    }
    const { maplibreMap } = this.mapboxLayer;
    if (!maplibreMap.getSource(this.sourceId)) {
      maplibreMap.addSource(this.sourceId, {
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
    if (!this.mapboxLayer.maplibreMap.style) {
      return;
    }
    const { maplibreMap } = this.mapboxLayer;
    const source = maplibreMap.getSource(this.sourceId);
    if (source) {
      // Don't remove source just make it empty.
      // Because others layers during unmount still could rely on it.
      source.setData({
        type: "FeatureCollection",
        features: [],
      });
    }
  }

  // Deactivate highlight and select style.
  // eslint-disable-next-line class-methods-use-this
  highlight() {}

  // eslint-disable-next-line class-methods-use-this
  select() {}

  clone(newOptions) {
    return new StationsLayer({ ...this.options, ...newOptions });
  }
}

export default StationsLayer;
