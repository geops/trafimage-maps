import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon } from 'ol/style';
import { VectorLayer as MTVectorLayer } from 'mobility-toolbox-js/ol';
import poiImage from './img/poi.png';
import poiImageHL from './img/poi_hl.png';

class StsPoisLayer extends MTVectorLayer {
  constructor(options) {
    const olLayer = new VectorLayer({
      visible: options?.visible,
      source: new VectorSource({
        url: 'https://maps.trafimage.ch/sts-static/pois.geojson',
        format: new GeoJSON({
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        }),
      }),
      style: (feature) => {
        return feature.get('selected')
          ? [
              new Style({
                image: new Icon({
                  src: poiImageHL,
                  anchor: [0.5, 41],
                  anchorYUnits: 'pixels',
                }),
              }),
            ]
          : [
              new Style({
                image: new Icon({
                  src: poiImage,
                  anchor: [0.5, 41],
                  anchorYUnits: 'pixels',
                }),
              }),
            ];
      },
    });
    super({ ...options, olLayer });
  }
}

export default StsPoisLayer;
