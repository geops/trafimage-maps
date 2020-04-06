import React from 'react';
import { fromLonLat } from 'ol/proj';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import Search from '../Search';

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
      .then(featureCollection => featureCollection.features)
      .catch(() => {
        return [];
      });
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
        if (mbMap.isSourceLoaded('stations')) {
          this.onDataEvent();
        } else {
          // We can't rely on sourcedata because isSourceLoaded returns false.
          mbMap.on('idle', this.onDataEvent);
        }
      });
    }
  }

  onDataEvent() {
    const { layerService, dispatchSetFeatureInfo } = this.props;
    const { mbMap } = layerService.getLayer('ch.sbb.netzkarte.data');

    if (mbMap.isSourceLoaded('stations')) {
      mbMap.off('idle', this.onDataEvent);
    } else {
      return;
    }

    // We get feature infos only for layer that use the source 'stations'.
    const infoLayers = layerService.getLayersAsFlatArray().filter(layer => {
      const { styleLayers } = layer;
      if (!styleLayers) {
        return [];
      }
      const sourceIds = styleLayers.map(({ source }) => source);
      return (
        layer.getVisible() &&
        layer instanceof MapboxStyleLayer &&
        sourceIds.includes('stations')
      );
    });

    // Here we simulate a click, it's the best way to get the proper popup informations.
    // The only drawback is that if the station is not rendered there is no popup.
    const infos = infoLayers
      .map(layer =>
        layer.getFeatureInfoAtCoordinate(
          fromLonLat(this.popupItem.geometry.coordinates),
        ),
      )
      .filter(i => i);

    Promise.all(infos).then(featureInfos => {
      dispatchSetFeatureInfo(
        featureInfos.filter(({ features }) => features.length),
      );
    });
  }
}

export default StopFinder;
