// import { Vector as OLVectorLayer } from 'ol/layer';
// import VectorSource from 'ol/source/Vector';
// import GeoJSON from 'ol/format/GeoJSON';
// import Feature from 'ol/Feature';
// import intersect from '@turf/intersect';
// import { Style, Fill, Stroke } from 'ol/style';
import MapboxStyleLayer from '../MapboxStyleLayer/MapboxStyleLayer';

/**
 * Layer for TarifverbundkarteLayer
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class MapsGeoAdminWmtsLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super({ ...options });
    // this.selectedZone = null;
    // this.highlightSource = this.children[0].olLayer.getSource(); // Get vector layer source
  }

  //   init(map) {
  //     super.init(map);
  //     this.olListenersKeys.push(
  //       map.on('pointermove', (evt) => {
  //         const thing = map.forEachLayerAtPixel(evt.pixel, (layer, pixel) => {
  //           return pixel;
  //           //   const height =
  //           //     -10000 + (pixel[0] * 256 * 256 + pixel[1] * 256 + pixel[2]) * 0.01;
  //           //   console.log(height);
  //         });
  //         console.log(thing);
  //         return thing;
  //         //   undefined,
  //         //   (layer) => {
  //         //     console.log(layer.getSource());
  //         //     return layer.getSource();
  //         //   },
  //         // );
  //       }),
  //     );
  //   }

  //   getFeatureInfoAtCoordinate(coordinate) {
  //     return super.getFeatureInfoAtCoordinate(coordinate).then((data) => {
  //       const { map } = data.layer;
  //       // if (map && this.tracker && this.tracker.canvas) {
  //       //   const context = this.tracker.canvas.getContext('2d');
  //       //   const pixel = this.map.getPixelFromCoordinate(coordinate);
  //       //   return !!context.getImageData(
  //       //     pixel[0] * this.pixelRatio,
  //       //     pixel[1] * this.pixelRatio,
  //       //     1,
  //       //     1,
  //       //   ).data[3];
  //       // }
  //       // return false;

  //       //   console.log(data.layer);
  //       return data;
  //     });
  //   }
}

export default MapsGeoAdminWmtsLayer;
