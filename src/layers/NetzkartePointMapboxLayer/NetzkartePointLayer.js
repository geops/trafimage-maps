import MapboxLayer from 'react-spatial/layers/MapboxLayer';

/**
 * Layer for visualizing information about stations (default) or airports.
 * The popup contains links to station plans, station coordinates
 * and links to timetable, services, shopping, handicap information.
 *
 * <img src="img/layers/NetzkartePointLayer/layer.png" alt="Layer preview" title="Layer preview">
 *
 * Extends {@link https://react-spatial.geops.de/docjs.html#mapboxlayer geops-spatial/layers/MapboxLayer}
 * @class
 * @param {Object} [options] Layer options.
 * @inheritdoc
 */
class NetzkartePointMapboxLayer extends MapboxLayer {
  /* constructor(options = {}) {
    let name = 'ch.sbb.netzkarte.stationen';
    let key = 'ch.sbb.netzkarte.stationen';

    if (options.showAirports) {
      name = 'ch.sbb.netzkarte.flughafen';
      key = 'ch.sbb.netzkarte.flughafen';
    }

    const olLayer = new OLVectorLayer({
      source: new OLVectorSource({
        format: new OLGeoJSON(),
        ...(options.useBboxStrategy ? { strategy: OLBboxStrategy } : {}),
      }),
    });

    super({
      ...options,
      name,
      key,
      olLayer,
      radioGroup: 'stations',
    });

    this.showAirports = !!options.showAirports;
    this.useBboxStrategy = !!options.useBboxStrategy;
    this.highlightFeature = null;

    this.url = `${CONF.geoserverUrl}?`;
    this.urlParams = {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: options.showAirports
        ? 'trafimage:netzkarte_airport_point'
        : 'trafimage:netzkarte_point',
    };

    this.defaultStyle = new OLStyle({
      image: new OLCircle({
        radius: 10,
        fill: new OLFill({
          color: 'rgba(255,255,255,0.01)',
        }),
      }),
    });

    this.highlightStyle = new OLStyle({
      image: new OLCircle({
        radius: 10,
        fill: new OLFill({
          color: 'rgba(0,61,155,0.5)',
        }),
      }),
    });

    this.olLayer.setStyle((f, r) => this.styleFunction(f, r));
    this.olLayer.getSource().setLoader(this.loader.bind(this));
    this.onClick(features => {
      this.highlightFeature = features.length ? features[0] : null;
      this.olLayer.getSource().changed();
    });
  } */
  /**
   * Create Style from feature and resolution
   * @private
   * @param {ol.feature} f {@link https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html ol/Feature}
   * @param {number} r The views resolution
   * @returns {Object|null} Style
   */
  /* styleFunction(f, r) {
    const res = layerHelper.getDataResolution(r);
    if (f.get('resolution') === res && f.get('visibility') >= res * 10) {
      if (f === this.highlightFeature) {
        return this.highlightStyle;
      }

      return this.defaultStyle;
    }

    return null;
  } */
}

export default NetzkartePointMapboxLayer;
