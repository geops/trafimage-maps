import React from "react";
import { Typography } from "@mui/material";
import { fromLonLat } from "ol/proj";
import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import Search from "../Search";
import { HANDICAP_SOURCE } from "../../utils/constants";

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
      `${this.stopsUrl}/?&q=${encodeURIComponent(value)}&key=${this.apiKey}`,
      {
        signal,
      },
    )
      .then((data) => data.json())
      .then((featureCollection) => {
        return featureCollection?.features || [];
      })
      .catch(() => {
        return [];
      });
  }

  render(item) {
    return (
      <div className="wkp-search-suggestion">
        <Typography>{item.properties.name}</Typography>
      </div>
    );
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
    const { mbMap } = layerService.getLayer("ch.sbb.handicap.data");

    if (
      mbMap.getSource(HANDICAP_SOURCE) &&
      mbMap.isSourceLoaded(HANDICAP_SOURCE)
    ) {
      mbMap.off("idle", this.onIdle);
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
        layer instanceof MapboxStyleLayer && sourceIds.includes(HANDICAP_SOURCE)
      );
    });

    // Here we simulate a click, it's the best way to get the proper popup informations.
    // The only drawback is that if the station is not rendered there is no popup.
    const coordinates = fromLonLat(this.popupItem.geometry.coordinates);
    const infos = infoLayers
      .map((layer) => layer.getFeatureInfoAtCoordinate(coordinates))
      .filter((i) => i);

    Promise.all(infos).then((featInfos) => {
      this.featureInfos = featInfos.filter(({ features }) => features.length);
      dispatchSetFeatureInfo(this.featureInfos);
    });
  }

  clearPopup() {
    this.popupItem = null;
    return this.featureInfos;
  }
}

export default HandicapStopFinder;
