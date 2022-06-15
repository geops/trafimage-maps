import React from 'react';
import { fromLonLat } from 'ol/proj';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import Search from '../Search';

class HandicapStopFinder extends Search {
  constructor() {
    super();
    this.onIdle = this.onIdle.bind(this);
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  search(value) {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    return fetch(
      `${this.stopsUrl}?&q=${encodeURIComponent(value)}&key=${this.apiKey}`,
      {
        signal,
      },
    )
      .then((data) => data.json())
      .then((featureCollection) => featureCollection.features)
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
    const layer = layerService.getLayer('ch.sbb.handicap.data');

    if (layer) {
      const { mbMap } = layer;
      if (mbMap.loaded() && mbMap.isStyleLoaded()) {
        this.onIdle();
      } else {
        // We can't rely on sourcedata because isSourceLoaded returns false.
        mbMap.on('idle', this.onIdle);
      }
    }
  }

  onIdle() {
    const { layerService, dispatchSetFeatureInfo } = this.props;
    const { mbMap } = layerService.getLayer('ch.sbb.handicap.data');

    if (
      mbMap.getSource('ch.sbb.handicap') &&
      mbMap.isSourceLoaded('ch.sbb.handicap')
    ) {
      mbMap.off('idle', this.onIdle);
    } else {
      return;
    }

    const styleLayers = mbMap?.getStyle()?.layers;

    // We get feature infos only for layer that use the source 'ch.sbb.handicap'.
    const infoLayers = layerService.getLayersAsFlatArray().filter((layer) => {
      const { visible, styleLayersFilter } = layer;
      if (!visible || !styleLayers || !styleLayersFilter) {
        return false;
      }
      const sourceIds = styleLayers
        .filter(styleLayersFilter)
        .map(({ source }) => source);
      return (
        layer instanceof MapboxStyleLayer &&
        sourceIds.includes('ch.sbb.handicap')
      );
    });

    // Here we simulate a click, it's the best way to get the proper popup informations.
    // The only drawback is that if the station is not rendered there is no popup.
    const coordinates = fromLonLat(this.popupItem.geometry.coordinates);
    const infos = infoLayers
      .map((layer) => layer.getFeatureInfoAtCoordinate(coordinates))
      .filter((i) => i);

    Promise.all(infos).then((featInfos) => {
      const featureInfos = featInfos.filter(({ features }) => features.length);
      dispatchSetFeatureInfo(featureInfos);
    });
  }
}

export default HandicapStopFinder;
