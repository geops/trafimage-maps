// import { Vector as OLVectorLayer } from 'ol/layer';
// import VectorSource from 'ol/source/Vector';
// import GeoJSON from 'ol/format/GeoJSON';
// import Feature from 'ol/Feature';
// import intersect from '@turf/intersect';
// import { Style, Fill, Stroke } from 'ol/style';
import MapboxStyleLayer from '../MapboxStyleLayer/MapboxStyleLayer';

/**
 * Layer for MapsGeoAdminWmts
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class MapsGeoAdminWmtsLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super({ ...options });
  }
}

export default MapsGeoAdminWmtsLayer;
