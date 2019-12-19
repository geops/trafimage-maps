import OLGeoJSON from 'ol/format/GeoJSON';
import {
  Style as OLStyle,
  Circle as OLCircle,
  Fill as OLFill,
  Stroke as OLStroke,
} from 'ol/style';
import { Engine } from 'react-transit/components/Search';

const createTrafimageEngine = (Base = Engine) =>
  class TrafimageEngine extends Base {
    constructor() {
      super();
      this.geoJSON = new OLGeoJSON();
      this.showInPlaceholder = true;
      this.dataProjection = 'EPSG:4326';
      this.highlightStyle = new OLStyle({
        image: new OLCircle({
          radius: 10,
          fill: new OLFill({
            color: 'rgba(0,61,155,0.5)',
          }),
        }),
        fill: new OLFill({ color: 'rgba(0,61,155,0.2)' }),
        stroke: new OLStroke({ color: 'rgba(0,61,155,0.5)', width: 10 }),
      });
    }

    getFeature(item, options) {
      const feature = this.geoJSON.readFeature(item, {
        ...options,
        dataProjection: this.dataProjection,
      });

      feature.setStyle(this.highlightStyle);
      return feature;
    }

    setProps(props) {
      this.props = props;
    }

    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    openPopup() {
      // Can be implemented by sub-classes
    }

    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    select(item) {
      // Can be overwritten by sub-classes.
    }
  };

export default createTrafimageEngine;
