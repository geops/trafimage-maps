import { MapboxStyleLayer } from "mobility-toolbox-js/ol";

/**
 * RegionenkarteLayer class
 * Extends {@link https://mobility-toolbox-js.geops.io/doc/class/build/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class RegionenkarteLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super(options);
    this.setHighlightFilter = this.setHighlightFilter.bind(this);
  }

  setHighlightFilter(filter) {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    const layerId = "anlagenverantwortliche.lines.select";
    const lyr = mbMap.getLayer(layerId);
    if (lyr) {
      mbMap.setFilter(layerId, filter);
      if (filter) {
        mbMap.setLayoutProperty(layerId, "visibility", "visible");
        return;
      }
      mbMap.setLayoutProperty(layerId, "visibility", "none");
    }
  }

  // Deactivate select style, since we don't use the selectedFeatures for highlighting
  select() {
    this.selectedFeatures = [];
    this.highlightedFeatures = [];
  }

  clone(newOptions) {
    return new RegionenkarteLayer({ ...this.options, ...newOptions });
  }
}

export default RegionenkarteLayer;
