import React from 'react';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { transform } from 'ol/proj';

import Search from '../Search';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';

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
    const layer = layerService.getLayer('ch.sbb.netzkarte.stationen');

    if (layer) {
      const { mbMap } = layer.mapboxLayer;

      if (mbMap.isStyleLoaded()) {
        this.onDataEvent();
      } else {
        mbMap.on('data', this.onDataEvent);
      }
    }
  }

  getFeatureInfoForLayer(layer) {
    const uic = parseInt(this.popupItem.properties.id, 10);
    const mbFeature = layer
      .getFeatures()
      .find(s => parseInt(8500000 + s.properties.didok, 10) === uic);

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
    const { layerService, dispatchSetFeatureInfo } = this.props;
    const layer = layerService.getLayer('ch.sbb.netzkarte.stationen');
    const { mbMap } = layer.mapboxLayer;

    if (mbMap.isStyleLoaded()) {
      mbMap.off('data', this.onDataEvent);
    }

    const infoLayers = layerService
      .getLayersAsFlatArray()
      .filter(l => l.getVisible() && l instanceof MapboxStyleLayer);

    const infos = infoLayers
      .map(l => this.getFeatureInfoForLayer(l))
      .filter(i => i);

    dispatchSetFeatureInfo(infos);
  }
}

export default StopFinder;
