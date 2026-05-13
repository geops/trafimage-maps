import {
  MapsGeneralSubClass,
  MapsGeneralSubClassValues,
  MapsTrafimageFilter,
  MapsTrafimageFilterValues,
  PLATFORMS_POLYGON_HIGHLIGHT_LAYER_ID,
  PLATFORMS_SOURCE_ID,
} from "../../utils/constants";
import MapboxStyleLayer from "../MapboxStyleLayer";

/**
 * Layer for displaying blue circle on platforms on hover.
 * Extends {@link https://mobility-toolbox-js.geops.io/doc/class/build/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class PlatformsLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    const id = PLATFORMS_SOURCE_ID;
    super({
      styleLayersFilter: ({ metadata }) =>
        !!metadata &&
        metadata[MapsTrafimageFilter] === MapsTrafimageFilterValues.PLATFORMS,
      properties: {
        hideInLegend: true,
        popupComponent: "StationPopup",
        useOverlay: true,
        isQueryable: true,
      },
      ...options,
    });

    this.source = {
      id,
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    };

    this.onIdle = this.onIdle.bind(this);
  }

  /**
   * @override
   */
  attachToMap(map) {
    super.attachToMap(map);

    this.olListenersKeys.push(
      this.on("change:visible", () => {
        this.updateSource();
      }),
      this.map.on("moveend", () => {
        this.mapboxLayer.mbMap?.once("idle", this.onIdle);
      }),
    );
  }

  /**
   * @override
   */
  detachFromMap(map) {
    const { mbMap } = this.mapboxLayer;
    if (mbMap) {
      mbMap.off("idle", this.onIdle);
      this.removeSource();
    }
    super.detachFromMap(map);
  }

  /**
   * On Mapbox map load callback function. Add style sources then style layers.
   * @override
   */
  onLoad() {
    const { mbMap } = this.mapboxLayer;
    this.platformLayers = mbMap
      .getStyle()
      .layers.filter(
        ({ metadata }) =>
          !!metadata &&
          metadata[MapsGeneralSubClass] ===
            MapsGeneralSubClassValues.STOP_POSITION,
      );
    console.log(this.platformLayers);

    this.platformLayers = this.platformLayers.map((layer) => layer.id);

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
  }

  // Query the rendered stations then add them to the source.
  updateSource() {
    const { mbMap } = this.mapboxLayer;
    const source = mbMap.getSource(this.source.id);

    if (!this.platformLayers || !source) {
      if (!source) {
        console.warn(
          `Source with id ${this.source.id} not found in the style, impossible to display platforms polygons highlight.`,
        );
      }
      return;
    }
    const uids = []; // ['==', 'uid', '496211a5d7ec6962'];
    const pointsRendered = mbMap
      .queryRenderedFeatures({
        layers: this.platformLayers,
      })
      .map((feat) => {
        const { geometry } = feat;

        if (geometry.type === "Polygon") {
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

    if (mbMap.getLayer(PLATFORMS_POLYGON_HIGHLIGHT_LAYER_ID)) {
      // we display only visible platorm polygons
      mbMap.setFilter(PLATFORMS_POLYGON_HIGHLIGHT_LAYER_ID, [
        "all",
        ["==", ["geometry-type"], "Polygon"],
        ["in", ["get", "uid"], ["literal", uids]],
      ]);
    } else {
      console.warn(
        `Layer with id ${PLATFORMS_POLYGON_HIGHLIGHT_LAYER_ID} not found in the style, impossible to display platforms polygons highlight.`,
      );
    }

    source.setData({
      type: "FeatureCollection",
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
        type: "FeatureCollection",
        features: [],
      });
    }
  }

  getFeatureInfoAtCoordinate(coordinate, options) {
    return super
      .getFeatureInfoAtCoordinate(coordinate, options)
      .then((featureInfo) => {
        // We want only one platform selected at a time, to avoid having duplication of data in the popup
        return {
          ...featureInfo,
          features: featureInfo.features.length
            ? [featureInfo.features[0]]
            : [],
        };
      });
  }
}

export default PlatformsLayer;
