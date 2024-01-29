/* eslint-disable no-useless-return */
import { MapboxStyleLayer } from "mobility-toolbox-js/ol";

/**
 * Layer for LabelDisplaceLayer
 * Extends {@link https://mobility-toolbox-js.geops.io/doc/class/build/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class LabelDisplaceLayer extends MapboxStyleLayer {
  // eslint-disable-next-line no-unused-vars
  addDisplaceFeatures(features = []) {
    const { mbMap } = this.mapboxLayer;

    if (!mbMap) {
      return;
    }

    const styleLayer = mbMap.getStyle().layers.find(this.styleLayersFilter);
    const source = mbMap.getSource(styleLayer.source);
    source.setData([
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [-122.483696, 37.833818],
            [-122.483482, 37.833174],
            [-122.483396, 37.8327],
            [-122.483568, 37.832056],
            [-122.48404, 37.831141],
            [-122.48404, 37.830497],
            [-122.483482, 37.82992],
            [-122.483568, 37.829548],
            [-122.48507, 37.829446],
            [-122.4861, 37.828802],
            [-122.486958, 37.82931],
            [-122.487001, 37.830802],
            [-122.487516, 37.831683],
            [-122.488031, 37.832158],
            [-122.488889, 37.832971],
            [-122.489876, 37.832632],
            [-122.490434, 37.832937],
            [-122.49125, 37.832429],
            [-122.491636, 37.832564],
            [-122.492237, 37.833378],
            [-122.493782, 37.833683],
          ],
        },
      },
    ]);
    return;
  }
}

export default LabelDisplaceLayer;
