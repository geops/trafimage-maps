import React from 'react';
import { fromLonLat } from 'ol/proj';
import Search from '../Search';

class StopFinder extends Search {
  constructor() {
    super();
    this.onDataEvent = this.onDataEvent.bind(this);
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
      `${this.stopsUrl}?&q=${encodeURIComponent(value)}&key=${
        this.apiKey
      }&limit=50`,
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
    const layer = layerService.getLayer('ch.sbb.netzkarte.data');

    if (layer) {
      const { mbMap } = layer;
      if (mbMap.loaded() && mbMap.isStyleLoaded()) {
        this.onDataEvent();
      } else {
        mbMap.once('idle', () => {
          if (mbMap.getSource('stations') && mbMap.isSourceLoaded('stations')) {
            this.onDataEvent();
          } else {
            // We can't rely on sourcedata because isSourceLoaded returns false.
            mbMap.on('idle', this.onDataEvent);
          }
        });
      }
    }
  }

  onDataEvent() {
    const { layerService, dispatchSetFeatureInfo } = this.props;
    const { mbMap } = layerService.getLayer('ch.sbb.netzkarte.data');

    if (mbMap.getSource('stations') && mbMap.isSourceLoaded('stations')) {
      mbMap.off('idle', this.onDataEvent);
    } else {
      return;
    }
    const styleLayers = mbMap?.getStyle()?.layers;

    // We get feature infos only for layer that use the source 'stations'.
    const infoLayers = layerService.getLayersAsFlatArray().filter((layer) => {
      const { styleLayersFilter } = layer;
      if (!styleLayers || !styleLayersFilter) {
        return false;
      }
      const sourceIds = styleLayers
        .filter(styleLayersFilter)
        .map(({ source }) => source);
      return (
        layer.visible && layer.isQueryable && sourceIds.includes('stations')
      );
    });

    // Here we simulate a click, it's the best way to get the proper popup informations.
    // The only drawback is that if the station is not rendered there is no popup.
    const infos = infoLayers
      .map((layer) =>
        layer.getFeatureInfoAtCoordinate(
          fromLonLat(this.popupItem.geometry.coordinates),
        ),
      )
      .filter((i) => i);

    Promise.all(infos).then((featureInfos) => {
      dispatchSetFeatureInfo(
        featureInfos.filter(({ features }) => features.length),
      );
    });
  }
}

export default StopFinder;
