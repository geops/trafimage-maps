import { MaplibreStyleLayer as MTMapboxStyleLayer } from "mobility-toolbox-js/ol";

/**
 * Layer for visualizing information about stations (default) or airports.
 * The popup contains links to station plans, station coordinates
 * and links to timetable, services, shopping, handicap information.
 *
 * <img src="img/layers/stationsLayer/layer.png" alt="Layer preview" title="Layer preview">
 *
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/Layer%20js~Layer%20html}
 * @class
 * @param {Object} [options] Layer options.
 * @inheritdoc
 * @private
 */
class MapboxStyleLayer extends MTMapboxStyleLayer {
  get mapboxLayer() {
    return this.get("maplibreLayer");
  }

  constructor(options = {}) {
    // For v3
    if (options.mapboxLayer) {
      // eslint-disable-next-line no-param-reassign
      options.maplibreLayer = options.mapboxLayer;
      // eslint-disable-next-line no-param-reassign
      delete options.mapboxLayer;
    }
    super({
      ...options,
      isHoverActive: false,
      isClickActive: false,
    });

    this.style = options.style;
    this.filters = options.filters;
    this.hidePopupFunc = options.hidePopup;
    this.hoveredFeatures = []; // When the feature is under the mouse and selectable
    this.highlightedFeatures = []; // When the clicked is clicked abnd available in feature information.
    this.selectedFeatures = []; // When the feature properties is displayed in feature information.
    this.onMouseLeave = () => {
      this.hover();
    };
  }

  attachToMap(map) {
    super.attachToMap(map);
    this.olEventsKeys.push(
      this.on("change:visible", () => {
        if (!this.visible) {
          this.cleanFeatureState();
        }
      }),
    );

    this.map
      ?.getTargetElement()
      ?.addEventListener("mouseleave", this.onMouseLeave);
  }

  detachFromMap(map) {
    this.map
      ?.getTargetElement()
      ?.removeEventListener("mouseleave", this.onMouseLeave);
    super.detachFromMap(map);
  }

  cleanFeatureState() {
    // Cleaning order is important to avoid having a feature with a bad hover state
    this.select();
    this.highlight();
    this.hover();
    this.hoveredFeatures = [];
    this.highlightedFeatures = [];
    this.selectedFeatures = [];
  }

  hidePopup(feat, layer, featureInfo) {
    return this.hidePopupFunc && this.hidePopupFunc(feat, layer, featureInfo);
  }

  /**
   * Apply visibility to style layers that fits the filter function.
   * @private
   */
  applyLayoutVisibility(evt) {
    const { visible } = this;
    const style = this.mapboxLayer?.maplibreMap?.getStyle();

    if (!style) {
      return;
    }

    if (this.style && visible && this.style !== this.mapboxLayer.style) {
      this.mapboxLayer.style = this.style;
    }

    super.applyLayoutVisibility(evt);
  }

  getFeatureInfoAtCoordinate(...args) {
    return super.getFeatureInfoAtCoordinate(...args).then((featureInfo) => {
      let { features } = featureInfo;
      const filter = this.get("featureInfoFilter");
      if (filter) {
        features = featureInfo.features.filter(filter);
      }
      return { ...featureInfo, features, layer: this };
    });
  }

  /**
   * Set the hover state to true/false to a list of features.
   * @param {Array<ol/Feature~Feature>} features
   * @param {boolean} state Is the feature hovered
   * @private
   */
  setFeatureState(features, state) {
    if (!this.mapboxLayer?.maplibreMap) {
      return;
    }
    const { maplibreMap } = this.mapboxLayer;

    if (!features || !maplibreMap) {
      return;
    }

    features.forEach((feature) => {
      const { source, sourceLayer } = feature.get("mapboxFeature") || {};
      if ((!source && !sourceLayer) || !feature.getId()) {
        if (!feature.getId()) {
          // eslint-disable-next-line no-console
          console.warn(
            "No feature's id found. To use the feature state functionnality, tiles must be generated with --generate-ids. See https://github.com/mapbox/tippecanoe#adding-calculated-attributes.",
            feature.getId(),
            feature.getProperties(),
          );
        }
        return;
      }

      maplibreMap.setFeatureState(
        {
          id: feature.getId(),
          source,
          sourceLayer,
        },
        state,
      );
    });
  }

  /**
   * Set the hover state to true/false to a list of features.
   * @param {Array<ol/Feature~Feature>} features
   * @param {boolean} state Is the feature hovered
   * @private
   */
  setHoverState(features, hoverState) {
    this.setFeatureState(features, { hover: hoverState });
  }

  /**
   * Highlight a list of features, setting the hover state to true to a list of features.
   * @param {Array<ol/Feature~Feature>} [features=[]] Features to highlight.
   * @private
   */
  hover(features = []) {
    // Filter out highlighted and selected features
    const filtered =
      this.hoveredFeatures?.filter(
        (feature) =>
          ![
            ...(this.selectedFeatures || []),
            ...(this.highlightedFeatures || []),
          ]
            .map((feat) => feat.getId())
            .includes(feature.getId()),
      ) || [];

    this.setHoverState(filtered, false);
    this.hoveredFeatures = features;
    this.setHoverState(this.hoveredFeatures, true);
  }

  /**
   * Highlight a list of features, setting the hover state to true to a list of features.
   * @param {Array<ol/Feature~Feature>} [features=[]] Features to highlight.
   * @private
   */
  highlight(features = []) {
    // Filter out selected features
    const filtered =
      this.highlightedFeatures?.filter(
        (feature) =>
          !(this.selectedFeatures || [])
            .map((feat) => feat.getId())
            .includes(feature.getId()),
      ) || [];

    this.setHoverState(filtered, false);
    this.highlightedFeatures = features;
    this.setHoverState(this.highlightedFeatures, true);
  }

  /**
   * Apply a select style to alist of features.
   * @param {Array<ol/Feature~Feature>} [features=[]] Features to select.
   * @private
   */
  // eslint-disable-next-line class-methods-use-this
  select() {
    // By default no select state is applied
    // this.setFeatureState(this.selectedFeatures || [], {
    //   selected: false,
    // });
    // this.selectedFeatures = features;
    // this.setFeatureState(this.selectedFeatures || [], {
    //   selected: true,
    // });
  }

  /**
   * Create exact copy of the MapboxLayer
   * @returns {MapboxLayer} MapboxLayer
   */
  clone(newOptions) {
    return new MapboxStyleLayer({ ...this.options, ...newOptions });
  }
}

export default MapboxStyleLayer;
