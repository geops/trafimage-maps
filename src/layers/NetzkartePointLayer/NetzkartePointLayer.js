import qs from 'querystring';
import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import OLGeoJSON from 'ol/format/GeoJSON';
import { bbox as OLBboxStrategy } from 'ol/loadingstrategy';
import { Style as OLStyle, Circle as OLCircle, Fill as OLFill } from 'ol/style';
import CONF from '../../config/appConfig';
import layerHelper from '../layerHelper';

const netzkarteStyleCache = {};
function defaultStyle(feature) {
  const layer = feature.get('layer');
  if (!netzkarteStyleCache[layer]) {
    let zIndex = layer === 'Zug' ? 1 : 0;

    switch (layer) {
      case 'Zug':
        zIndex = 2;
        break;
      case 'Tram':
        zIndex = 1;
        break;
      default:
        zIndex = 0;
    }

    netzkarteStyleCache[layer] = [
      new OLStyle({
        zIndex,
        image: new OLCircle({
          radius: 10,
          fill: new OLFill({
            color: 'rgba(255,255,255,0.01)',
          }),
        }),
      }),
    ];
  }
  return netzkarteStyleCache[layer];
}

function airportStyle(feature, resolution) {
  const res = layerHelper.getDataResolution(resolution);
  if (
    feature.get('resolution') === res &&
    feature.get('visibility') >= res * 10
  ) {
    return defaultStyle(feature, resolution);
  }
  return null;
}

class NetzkartePointLayer extends VectorLayer {
  constructor(options = {}) {
    let name = 'Stationen';
    let key = 'ch.sbb.stationen';

    if (options.showAirports) {
      name = 'Flughäfen';
      key = 'ch.sbb.flughafen';
    }

    const vectorSource = new OLVectorSource({
      format: new OLGeoJSON(),
      strategy: OLBboxStrategy,
    });

    const olLayer = new OLVectorLayer({
      style: options.showAirports ? airportStyle : defaultStyle,
      source: vectorSource,
    });

    super({
      ...options,
      name,
      key,
      olLayer,
      radioGroup: 'stationen',
    });

    this.url = `${CONF.geoserverUrl}?service=WFS&version=1.0.0&request=GetFeature&`;

    this.urlParams = {
      typeName: options.showAirports
        ? 'trafimage:netzkarte_airport_point'
        : 'trafimage:netzkarte_point',
    };

    this.loader = this.loader.bind(this);
    this.vectorSource = vectorSource;
    vectorSource.setLoader(this.loader);
  }

  init(map) {
    super.init(map);
    this.map = map;
    const { olLayer } = this;

    // Clear the layer when the resolution changes
    // as the WFS is resolution dependent
    this.map.getView().on('change:resolution', () => {
      olLayer.getSource().clear();
    });
  }

  /**
   * Use a custom loader as our geoserver delivers the geojson with the legacy crs syntax
   * (similar to https://osgeo-org.atlassian.net/browse/GEOS-5996)
   * which results in an Assertion error 36, https://openlayers.org/en/latest/doc/errors/
   *
   * By using a custom the projection in the geojson does not matter
   * (compared to https://github.com/openlayers/openlayers/blob/v5.3.0/src/ol/featureloader.js#L88)
   *
   * This loader function is based on the loader example in
   * https://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html
   */
  loader(extent, resolution, projection) {
    const res = layerHelper.getDataResolution(resolution);
    const proj = projection.getCode();

    const urlParams = {
      ...this.urlParams,
      bbox: `${extent.join(',')},${proj}`,
      srsname: proj,
      viewparams: `resolution:${res}`,
      outputFormat: 'application/json',
    };
    const url = `${this.url}${qs.stringify(urlParams)}`;

    fetch(url)
      .then(data => data.json())
      .then(data => {
        this.vectorSource.addFeatures(
          this.vectorSource.getFormat().readFeatures(data),
        );
      })
      .catch(() => {
        this.vectorSource.removeLoadedExtent(extent);
      });
  }
}

export default NetzkartePointLayer;
