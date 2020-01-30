import React from 'react';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { transform } from 'ol/proj';

import Search from '../Search';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';

const endpoint = 'https://api.geops.io/stops/v1/';

class StopFinder extends Search {
  constructor() {
    super();

    this.onDataEvent = this.onDataEvent.bind(this);
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  search(value) {
    return fetch(`${endpoint}?&q=${value}&key=${this.apiKey}`)
      .then(data => data.json())
      .then(featureCollection => featureCollection.features);
  }

  render(item) {
    return <div>{item.properties.name}</div>;
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.properties.name;
  }

  openPopup(item) {
    this.popupItem = item;
    const { layerService } = this.props;
    const layer = layerService.getLayer('ch.sbb.netzkarte.data');

    if (layer) {
      const { mbMap } = layer;
      mbMap.once('idle', () => {
        if (mbMap.isSourceLoaded('base')) {
          this.onDataEvent();
        } else {
          mbMap.on('sourcedata', this.onDataEvent);
        }
      });
    }
  }

  getFeatureInfoForLayer(layer) {
    const uic = parseInt(this.popupItem.properties.id, 10);

    console.log('GET features', layer.getFeatures());
    console.log('this.popupItem.properties', this.popupItem.properties);
    const mbFeature = layer.getFeatures({
      source: 'base',
      sourceLayer: 'osm_points',
      filter: ['==', 'uid', this.popupItem.properties.uid],
    });

    console.log('GET mbFeature', mbFeature);
    if (mbFeature) {
      const feature = new Feature({
        geometry: new Point(
          transform(mbFeature.geometry.coordinates, 'EPSG:4326', 'EPSG:3857'),
        ),
        ...mbFeature.properties,
      });

      return {
        features: [feature],
        layer,
      };
    }

    return null;
  }

  onDataEvent() {
    const { layerService, dispatchSetClickedFeatureInfo } = this.props;
    const layer = layerService.getLayer('ch.sbb.netzkarte.data');
    const { mbMap } = layer;

    if (mbMap.isSourceLoaded('base')) {
      mbMap.off('sourcedata', this.onDataEvent);
    }

    const infoLayers = layerService
      .getLayersAsFlatArray()
      .filter(l => l.getVisible() && l instanceof TrafimageMapboxLayer);

    const infos = infoLayers
      .map(l => this.getFeatureInfoForLayer(l))
      .filter(i => i);

    infos.forEach(info => {
      // eslint-disable-next-line no-param-reassign
      info.popupComponent = 'NetzkartePopup';
    });
    dispatchSetClickedFeatureInfo(infos);
  }
}

export default StopFinder;
