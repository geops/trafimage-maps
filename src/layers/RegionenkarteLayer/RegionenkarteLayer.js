import MapboxStyleLayer from "../MapboxStyleLayer";

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

  // Deactivate highlight and select style.
  // eslint-disable-next-line class-methods-use-this
  highlight() {}

  // eslint-disable-next-line class-methods-use-this
  select() {}

  clone(newOptions) {
    return new RegionenkarteLayer({ ...this.options, ...newOptions });
  }
}

export default RegionenkarteLayer;
