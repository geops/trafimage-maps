import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import OLGeoJSON from 'ol/format/GeoJSON';
import { bbox as OLBboxStrategy } from 'ol/loadingstrategy';
import { Style as OLStyle, Circle as OLCircle, Fill as OLFill } from 'ol/style';
import CONF from '../../config/appConfig';

const netzkarteStyleCache = {};
function style(feature) {
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
            color: 'black',
            // color: 'rgba(255,255,255,0.01)',
          }),
        }),
      }),
    ];
  }
  return netzkarteStyleCache[layer];
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
function loader(extent, resolution, projection) {
  const vectorSource = this;
  const dataResolutions = [750, 500, 250, 100, 50, 20, 10, 5];

  // find closest data resolution
  const res = dataResolutions.reduce((prev, curr) =>
    Math.abs(curr - resolution) < Math.abs(prev - resolution) ? curr : prev,
  );

  const proj = projection.getCode();
  const url =
    `${CONF.geojsoncacheUrl}?layer=netzkarte_point&workspace=trafimage&` +
    `bbox=${extent.join(
      ',',
    )},EPSG:3857&resolution=${res}&geoserver=wkp&srsname=${proj}`;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);

  function onError() {
    vectorSource.removeLoadedExtent(extent);
  }
  xhr.onerror = onError;

  function onLoad() {
    if (xhr.status === 200) {
      vectorSource.addFeatures(
        vectorSource.getFormat().readFeatures(xhr.responseText),
      );
    } else {
      onError();
    }
  }
  xhr.onload = onLoad;

  xhr.send();
}

class NetzkartePointLayer extends VectorLayer {
  constructor(options = {}) {
    const name = 'Stationen';
    const key = 'ch.sbb.stationen';

    const vectorSource = new OLVectorSource({
      format: new OLGeoJSON(),
      url: (extent, resolution) => this.url(extent, resolution),
      strategy: OLBboxStrategy,
      loader,
    });

    const olLayer = new OLVectorLayer({
      style: (f, r) => style(f, r),
      source: vectorSource,
    });

    super({
      ...options,
      name,
      key,
      olLayer,
      radioGroup: 'stationen',
    });
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
}

export default NetzkartePointLayer;
