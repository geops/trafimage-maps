/* eslint-disable no-param-reassign */
import { GeoJSON } from 'ol/format';
import { unByKey } from 'ol/Observable';

import MapboxStyleLayer from '../MapboxStyleLayer';
import getTrafimageFilter from '../../utils/getTrafimageFilter';
import { DV_KEY } from '../../utils/constants';

const DV_TRIPS_SOURCELAYER_ID = 'ch.sbb.direktverbindungen_trips';

const DV_FILTER_REGEX = /^ipv_((trip|call)_)?(day|night|all)$/;
const DV_TRIP_FILTER_REGEX = /^ipv_(call|trip)_(day|night|all)$/;
const DV_STATION_HOVER_FILTER_REGEX = /^ipv_(station|label)$/;
const DV_STATION_CALL_LAYERID_REGEX =
  /^dv(d|n)?_call(_(border|bg|border(2)?|displace|label))?(_highlight)?/;

/**
 * Layer for visualizing international train connections.
 *
 * @class
 * @param {Object} [options] Layer options.
 * @inheritdoc
 * @private
 */

class DirektverbindungenLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super({
      ...options,
      queryRenderedLayersFilter: (layer) =>
        DV_TRIP_FILTER_REGEX.test(getTrafimageFilter(layer)) ||
        DV_STATION_HOVER_FILTER_REGEX.test(
          getTrafimageFilter(layer, 'trafimage.hover'),
        ),
      styleLayersFilter: (layer) => {
        return (
          DV_TRIP_FILTER_REGEX.test(getTrafimageFilter(layer)) ||
          DV_STATION_HOVER_FILTER_REGEX.test(
            getTrafimageFilter(layer, 'trafimage.hover'),
          )
        );
      },
    });
    this.allFeatures = [];
    this.syncTimeout = null;
  }

  onLoad() {
    super.onLoad();
    this.onChangeVisible();
    this.fetchDvFeatures();
    // We can only get the mapbox features from the view on load.
    // In order to assign the Cartaro features their corresponding
    // mapbox features for the full list view, we sync the features when
    // the view changes and add the mapbox feature to any ol feature
    // that still hasn't got one.
    this.viewChangeListener = this.map.on('moveend', () => {
      clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(() => {
        this.syncFeatures();
      }, 400);
    });
  }

  getMapboxFeatures() {
    const { mbMap } = this.mapboxLayer;
    if (mbMap) {
      const renderedMbFeatures = mbMap.querySourceFeatures(DV_KEY, {
        sourceLayer: DV_TRIPS_SOURCELAYER_ID,
        filter: ['==', '$type', 'LineString'],
      });
      return renderedMbFeatures;
    }
    return [];
  }

  /**
   * Assigns mapbox features to Cartaro ol features using their ID
   * @returns {array<ol.Feature>} Array of ol features
   */
  syncFeatures() {
    const mbFeatures = this.getMapboxFeatures();
    const cartaroFeatIsMissingMbFeat =
      this.allFeatures?.length &&
      !this.allFeatures.every((feat) => feat.get('mapboxFeature'));
    if (cartaroFeatIsMissingMbFeat && mbFeatures?.length) {
      this.allFeatures.forEach((feat) => {
        const mbFeature = mbFeatures.find((mbFeat) => {
          return mbFeat?.properties?.cartaro_id === feat?.get('id');
        });
        if (!feat.get('mapboxFeature')) {
          feat.set('mapboxFeature', mbFeature);
        }
      });
    }
    this.dispatchEvent({
      type: 'load:features',
      features: this.allFeatures,
      target: this,
    });
    return this.allFeatures;
  }

  /**
   * Fetch features from Cartaro for the list view
   */
  async fetchDvFeatures() {
    await fetch(
      'https://api.geops.io/cartaro/v1/direktverbindungen/?key=5cc87b12d7c5370001c1d655c9f9fcc168914865819eae10cbc671cf',
    )
      .then((res) => res.json())
      .then((data) => {
        const features = new GeoJSON().readFeatures(data);
        const { mbMap } = this.mapboxLayer;
        if (mbMap) {
          const dvRenderedMbFeatures = mbMap.querySourceFeatures(DV_KEY, {
            sourceLayer: DV_TRIPS_SOURCELAYER_ID,
            filter: ['==', '$type', 'LineString'],
          });
          dvRenderedMbFeatures.forEach((feat) => {
            feat.source = DV_KEY;
            feat.sourceLayer = DV_TRIPS_SOURCELAYER_ID;
          });
          features.forEach((feat) => {
            const mbFeature = dvRenderedMbFeatures.find(
              (mbFeat) => mbFeat?.properties?.cartaro_id === feat?.get('id'),
            );
            feat.set('mapboxFeature', mbFeature);
            feat.set('line', feat.get('tagverbindung') ? 'day' : 'night');
            feat.setId(mbFeature?.properties?.id);
            feat.setProperties({
              ...feat.getProperties(),
              ...mbFeature?.properties,
            });
          });
          this.allFeatures = features;
          this.syncFeatures();
        }
      })

      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }

  /**
   * @returns {array<mapbox.stylelayer>} Array of mapbox style layers
   */
  getDvLayers() {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return null;
    }
    const style = mbMap.getStyle();
    return style?.layers.filter((stylelayer) => {
      return DV_FILTER_REGEX.test(getTrafimageFilter(stylelayer));
    });
  }

  /**
   * Gets the current visible IPV layer
   * @returns {string} 'day', 'night' or 'all'
   */
  getCurrentLayer() {
    const nightLayer = this.get('nightLayer');
    const dayLayer = this.get('dayLayer');

    if (dayLayer?.get('visible') && nightLayer?.get('visible')) {
      this.visible = true;
      return 'all';
    }
    if (dayLayer?.get('visible') || nightLayer?.get('visible')) {
      const visibleLayer = [dayLayer, nightLayer].find((layer) =>
        layer.get('visible'),
      );
      this.visible = true;
      return visibleLayer.get('routeType');
    }
    this.visible = false;
    return null;
  }

  detachFromMap() {
    super.detachFromMap();
    unByKey(this.viewChangeListener);
  }

  // Updates the IPV mapbox stylelayer visibility according
  // to the current visible WKP layer
  onChangeVisible() {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    const currentLayer = this.getCurrentLayer();
    const filterRegex = new RegExp(`^ipv_(trip_)?(${currentLayer})$`);
    this.getDvLayers()?.forEach((stylelayer) => {
      mbMap.setLayoutProperty(
        stylelayer.id,
        'visibility',
        filterRegex.test(getTrafimageFilter(stylelayer)) ? 'visible' : 'none',
      );
    });
  }

  /**
   * Updates visibility for stations, labels and select highlight mb layers
   * and applies the mb filter for the currently selected feature
   */
  highlightFeatures() {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    const highlightRegex = new RegExp(
      `${DV_STATION_CALL_LAYERID_REGEX.source}_${this.getCurrentLayer()}$`,
    );
    const dvHighlightLayers = this.getDvLayers().filter((layer) =>
      highlightRegex.test(layer.id),
    );

    // Highlight stations and station labels on select
    dvHighlightLayers.forEach((layer) => {
      const idFilterExpression = [
        'get',
        /_highlight_/.test(layer.id) ? 'id' : 'direktverbindung_id',
      ];
      // Reset filter to original state
      const originalFilter = mbMap
        .getFilter(layer.id)
        ?.filter(
          (item) =>
            !(
              Array.isArray(item) &&
              item[1].toString() === idFilterExpression.toString()
            ),
        );
      mbMap.setFilter(layer.id, originalFilter);
      if (this.selectedFeatures.length) {
        mbMap.setLayoutProperty(layer.id, 'visibility', 'visible');
        this.selectedFeatures.forEach((feature) => {
          // Add feature id filter
          const featureIdFilter = [
            ...mbMap.getFilter(layer.id),
            ['==', idFilterExpression, feature.get('id')],
          ];
          mbMap.setFilter(layer.id, featureIdFilter);
        });
      } else {
        mbMap.setLayoutProperty(layer.id, 'visibility', 'none');
      }
    });
  }

  select(features = []) {
    super.select(features);
    this.highlightFeatures();
  }
}

export default DirektverbindungenLayer;
