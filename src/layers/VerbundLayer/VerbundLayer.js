import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {
  Style,
  Fill as FillStyle,
  Stroke as StrokeStyle,
  Text as TextStyle,
} from 'ol/style';
import { containsExtent } from 'ol/extent';
import MultiPolygon from 'ol/geom/MultiPolygon';
import { fromExtent } from 'ol/geom/Polygon';
import Feature from 'ol/Feature';
import { intersect } from 'turf';
import Layer from 'react-spatial/Layer';

/**
 * Layer for visualizing fare networks.
 * @class VerbundLayer
 * @param {Object} options Layer options.
 * @param {boolean} options.visible Visibility of the layer.
 * @param {string} options.url Url of the geOps fare network backend.
 */
class VerbundLayer extends Layer {
  constructor(options) {
    super({
      name: 'Verbundzonen',
      olLayer: new VectorLayer({
        source: new VectorSource(),
      }),
      ...options,
    });

    // Load features
    const url = (options || {}).url || '/public/sample_data/zones.geojson';
    this.loadFeatures(url);

    // Set style
    this.olLayer.setStyle((f, r) => this.zoneStyle(f, r));
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

  zoneStyle(feature, resolution) {
    const zone = parseInt(feature.get('zone'), 10);

    let opacity = 0.5;
    opacity = resolution < 100 ? 0.3 : opacity;
    opacity = resolution < 50 ? 0.1 : opacity;

    let textGeometry;
    const color = [255, 200, 25];

    if (resolution < 100) {
      // optimize text positioning
      const mapExtent = this.map.getView().calculateExtent();
      const geomExtent = feature.getGeometry().getExtent();

      if (!containsExtent(mapExtent, geomExtent)) {
        const mapPolygon = fromExtent(mapExtent);
        const format = new GeoJSON();
        const intersection = intersect(
          format.writeFeatureObject(new Feature(mapPolygon)),
          format.writeFeatureObject(feature),
        );

        if (intersection) {
          const intersectionFeature = format.readFeature(intersection);
          const geom = intersectionFeature.getGeometry();
          if (geom instanceof MultiPolygon) {
            textGeometry = geom.getInteriorPoints();
          } else {
            textGeometry = geom.getInteriorPoint();
          }
        }
      }
    }

    return [
      new Style({
        stroke: new StrokeStyle({
          color,
          width: 2,
        }),
        fill: new FillStyle({
          color: [...color, opacity],
        }),
      }),
      new Style({
        geometry: textGeometry,
        text: new TextStyle({
          font: '12px Arial',
          fill: new FillStyle({
            color: 'black',
          }),
          stroke: new StrokeStyle({
            color: 'white',
            width: 2,
          }),
          text: `${zone}`,
        }),
      }),
    ];
  }

  init(map) {
    super.init(map);
    this.map = map;
  }
}

export default VerbundLayer;
