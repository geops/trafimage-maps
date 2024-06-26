import MapboxStyleLayer from "../MapboxStyleLayer";
import lines from "./lines";
import getStyleLayers from "./getStyleLayers";

/**
 * Layer for zweitausbildung routes
 * Extends {@link https://mobility-toolbox-js.geops.io/doc/class/build/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class ZweitausbildungRoutesLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    const { property } = options.properties.zweitausbildung || {};
    super({
      ...options,
      styleLayers: [],
      beforeId: "ch.sbb.zweitausbildung_stations.aufbau.not.border",
    });
    this.property = property;
    this.sourceId = "ch.sbb.zweitausbildung";
    this.sourceLayer = "ch.sbb.zweitausbildung";
  }

  /**
   * On Mapbox map load callback function. Add the zweitausbildung data source then style layers.
   * @ignore
   */
  async onLoad() {
    const { mbMap } = this.mapboxLayer;

    // if the selected lines as extra sources we add it now, before adding stylelayers
    Object.entries(lines).forEach(([key, { property, extraSources }]) => {
      if (property !== this.property || !extraSources) {
        return;
      }

      Object.entries(extraSources).forEach(([sourceKey, sourceToAdd]) => {
        if (!mbMap.getSource(sourceKey)) {
          // First we add a property to the features so the lines will be automatically highlighted.
          sourceToAdd.data.features.forEach((feat) => {
            // eslint-disable-next-line no-param-reassign
            feat.properties[this.property] = key;
          });
          mbMap.addSource(sourceKey, sourceToAdd);
        }
      });
    });

    // We need to get the tileJson file of this source to have the list of
    // possible values for attribute hauptlinie and turistische_linie.
    // These values are generated by a script during tiles generation.
    const source = mbMap.getSource(this.sourceId);
    if (!source || !source.url) {
      return;
    }
    const tileJson = await fetch(source.url).then((response) =>
      response.json(),
    );
    this.styleLayers = getStyleLayers(this, tileJson);

    // We should not have to define again styleLayersFilter.
    // it's a bug in mbt, it should be fixed in next version.
    this.styleLayersFilter = (styleLayer) => {
      return !!this.styleLayers?.find((sl) => styleLayer.id === sl.id);
    };
    super.onLoad();
  }
}

export default ZweitausbildungRoutesLayer;
