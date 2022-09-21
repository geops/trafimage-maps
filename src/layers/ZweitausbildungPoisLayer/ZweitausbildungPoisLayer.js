import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';
import { GeoJSON } from 'ol/format';

/**
 * Layer for zweitausbildung pois
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class ZweitausbildungPoisLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    const { filter, sourceId } = options.properties.zweitausbildung;
    // We request cluster and unclustered point, not the number.
    super({
      ...options,
      queryRenderedLayersFilter: ({ metadata }) => {
        const mdValue = !!metadata && metadata['trafimage.filter'];
        return mdValue === sourceId && !/number/.test(mdValue);
      },
    });
    this.filter = filter;
    this.sourceId = sourceId;
    this.highlightSourceId = 'highlight';
    this.updateTimeout = null;
    this.format = new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });
    this.onIdle = this.onIdle.bind(this);
  }

  /**
   * @override
   */
  attachToMap(map) {
    super.attachToMap(map);

    this.olListenersKeys.push(
      this.on('change:visible', () => {
        this.updateClusterSource();
      }),
      this.map.on('movestart', () => {
        window.clearTimeout(this.updateTimeout);
      }),
      this.map.on('moveend', () => {
        this.mapboxLayer.mbMap?.once('idle', this.onIdle);
      }),
    );
  }

  /**
   * @override
   */
  detachFromMap(map) {
    window.clearTimeout(this.updateTimeout);
    const { mbMap } = this.mapboxLayer;
    if (mbMap) {
      mbMap.off('idle', this.onIdle);

      [this.sourceId, this.highlightSourceId].forEach((id) => {
        const source = mbMap.getSource(id);
        if (source) {
          // Don't remove source just make it empty.
          // Because others layers during unmount still could rely on it.
          source.setData({
            type: 'FeatureCollection',
            features: [],
          });
        }
      });
    }
    super.detachFromMap(map);
  }

  /**
   * On Mapbox map load callback function. Add style sources then style layers.
   * @override
   */
  onLoad() {
    super.onLoad();
    this.updateClusterSource();
  }

  /**
   * Callback when the map is on idle state after a moveend event.
   */
  onIdle() {
    window.clearTimeout(this.updateTimeout);
    this.updateTimeout = window.setTimeout(() => {
      this.updateClusterSource();
    }, 150);
  }

  // Upodate sources for features with multiple lines.
  updateClusterSource() {
    if (!this.visible || !this.map || !this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;
    const source = mbMap.getSource(this.sourceId);
    if (!source) {
      return;
    }

    let features;
    try {
      features = mbMap.querySourceFeatures('ch.sbb.zweitausbildung_pois', {
        sourceLayer: 'ch.sbb.zweitausbildung_pois',
        filter: this.filter,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      // console.error(e);
    }

    if (!features?.length) {
      return;
    }

    // Remove duplicated features.
    const ids = [];
    const uniqueFeatures = [];
    features.forEach((linee) => {
      const indexOf = ids.indexOf(linee.id);
      if (indexOf === -1) {
        ids.push(linee.id);
        uniqueFeatures.push(linee);
      }
    });

    source.setData({
      type: 'FeatureCollection',
      features: uniqueFeatures,
    });
  }

  highlightFromPopup(feature, toggle) {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }

    const data = this.format.writeFeaturesObject(toggle ? [feature] : []);
    const source = mbMap.getSource(this.highlightSourceId);
    if (source) {
      source.setData(data);
    }

    // Launch animation
    mbMap.setPaintProperty(
      this.highlightSourceId,
      'circle-radius',
      toggle ? 14 : 0,
    );
  }
}

export default ZweitausbildungPoisLayer;
