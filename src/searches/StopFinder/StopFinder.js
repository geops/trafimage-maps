import React from 'react';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { transform } from 'ol/proj';
import Search from '../Search';

const endpoint = 'https://api.geops.io/stops/v1/';

class StopFinder extends Search {
  constructor() {
    super();
    this.endpoint = endpoint;
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
    const mbFeature = layer.getFeatures({
      source: 'base',
      sourceLayer: 'osm_points',
      filter: ['==', 'uid', this.popupItem.properties.uid],
    })[0];

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
        coordinate: mbFeature.geometry.coordinates,
      };
    }

    return null;
  }

  onDataEvent() {
    const { layerService, dispatchSetFeatureInfo } = this.props;
    const layer = layerService.getLayer('ch.sbb.netzkarte.stationen');
    const { mbMap } = layer.mapboxLayer;

    if (mbMap.isSourceLoaded('base')) {
      mbMap.off('sourcedata', this.onDataEvent);
    }

    const infoLayers = layerService
      .getLayersAsFlatArray()
      .filter(l => l.getVisible());

    const infos = infoLayers
      .map(l => this.getFeatureInfoForLayer(l))
      .filter(i => i);

    dispatchSetFeatureInfo(infos);
  }
}

export default StopFinder;
