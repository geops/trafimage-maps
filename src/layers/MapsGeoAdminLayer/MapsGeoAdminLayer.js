import { Layer } from "mobility-toolbox-js/ol";
import GeoJSON from "ol/format/GeoJSON";

const format = new GeoJSON();

/**
 * Layer for MapsGeoAdminWmts
 * Extends {@link https://mobility-toolbox-js.geops.io/api/class/src/mapbox/layers/Layer%20js~Layer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class MapsGeoAdminLayer extends Layer {
  async getFeatureInfoAtCoordinate(coordinate) {
    const visibleChildLayers = this.children.filter((layer) => layer.visible);
    const layerFetches = await visibleChildLayers.map((layer) => {
      try {
        return fetch(
          `https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=${coordinate}&geometryFormat=geojson&geometryType=esriGeometryPoint&imageDisplay=981,887,96&lang=en&layers=all:${layer.key}&limit=10&mapExtent=1077496.888326246,5868002.761574163,1125190.8397187775,5911126.650346004&returnGeometry=true&sr=3857&tolerance=10`,
        )
          .then((res) => {
            if (!res.ok) {
              throw Error(`Identify API not applicable on ${layer.key}`);
            }
            return res.json();
          })
          .then((data) => {
            if (!data.results.length) {
              return null;
            }
            return data.results.map((feature) => {
              const feat = format.readFeature(feature);
              feat.set("layer", layer);
              return feat;
            });
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err);
            return null;
          });
      } catch {
        return null;
      }
    });
    const promises = await Promise.all(layerFetches);
    const features = promises.flat().filter((feature) => !!feature);
    return Promise.resolve({ features, layer: this, coordinate });
  }
}

export default MapsGeoAdminLayer;
