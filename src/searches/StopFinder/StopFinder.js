import React from "react";
import { fromLonLat } from "ol/proj";
import Search from "../Search";
import StopSearchResult from "../../components/StopSearchResult";

class StopFinder extends Search {
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
      `${this.stopsUrl}/?&q=${encodeURIComponent(value)}&key=${
        this.apiKey
      }&limit=50`,
      {
        signal,
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((featureCollection) => {
        return featureCollection?.features || [];
      })
      .catch(() => {
        return [];
      });
  }

  getItems() {
    if (this.collapsed) {
      // When collapsed we move first Swiss result to second position
      const sorted = [...this.items];
      const firstSwissStationIdx = sorted.findIndex(
        (feat) => feat.properties.country_code === "CH",
      );
      if (firstSwissStationIdx > 0) {
        sorted.splice(1, 0, sorted.splice(firstSwissStationIdx, 1)[0]);
      }
      return sorted.slice(0, 2);
    }
    return this.items;
  }

  render(item) {
    return <StopSearchResult properties={item?.properties} />;
  }

  // eslint-disable-next-line class-methods-use-this
  value(item) {
    return item.properties.name;
  }

  openPopup(item) {
    const { layerService } = this.props;
    const layer = layerService.getLayer("ch.sbb.netzkarte.stationen");

    if (!layer) {
      return;
    }
    this.popupItem = item;

    // We try to display the overlay only when the stations layer is ready and has all the stations loaded.
    if (layer.ready) {
      this.onIdle();
    } else {
      layer.once("datarendered", this.onIdle);
    }
  }

  onIdle() {
    if (!this.popupItem) {
      return;
    }
    const { layerService, dispatchSetFeatureInfo } = this.props;
    const { mbMap } = layerService.getLayer("ch.sbb.netzkarte.data");
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
        layer.visible &&
        layer.get("isQueryable") &&
        sourceIds.includes("stations")
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
      this.featureInfos = featureInfos.filter(
        ({ features }) => features.length,
      );
      dispatchSetFeatureInfo(this.featureInfos);
    });
  }

  clearPopup() {
    this.popupItem = null;
    return this.featureInfos;
  }
}

export default StopFinder;
