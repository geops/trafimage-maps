import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Layer from 'react-spatial/Layer';
import PropTypes from 'prop-types';

const propTypes = {
  foo: PropTypes.string.isRequired,
};

/**
 * Class for Verbundlayer.
 */
class VerbundLayer extends Layer {
  constructor(options) {
    super({
      name: 'Verbundzonen',
      visible: true,
      olLayer: new VectorLayer({
        source: new VectorSource(),
      }),
      ...options,
    });

    const url = (options || {}).url || '/public/sample_data/zones.geojson';
    this.loadFeatures(url);
  }

  loadFeatures(url) {
    const format = new GeoJSON();
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const features = format.readFeatures(data);
        this.olLayer.getSource().clear();
        this.olLayer.getSource().addFeatures(features);
      });
  }
}

VerbundLayer.propTypes = propTypes;
export default VerbundLayer;
