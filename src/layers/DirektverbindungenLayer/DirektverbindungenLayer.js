/* eslint-disable no-param-reassign */
import { LineString, MultiLineString } from "ol/geom";
import { unByKey } from "ol/Observable";
import { Feature } from "ol";

import MapboxStyleLayer from "../MapboxStyleLayer";
import getTrafimageFilter from "../../utils/getTrafimageFilter";
import { DV_KEY } from "../../utils/constants";

const DV_TRIPS_SOURCELAYER_ID = "ch.sbb.direktverbindungen_trips";
const DV_FILTER_REGEX = /^ipv_(.+)?(day|night|all)$/;
const DV_FILTER_UNSELECTED_REGEX = /^ipv_(day|night|all)$/;
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
      queryRenderedLayersFilter: (layer) => {
        const clickRegex = new RegExp(
          `^ipv_(call_)?((station||full)_)?${this.getCurrentLayer()}`,
        );
        return (
          clickRegex.test(getTrafimageFilter(layer)) &&
          !/(displace|edge_bg)/.test(layer.id) // Avoid detecting displace layer
        );
      },
      styleLayersFilter: (layer) =>
        DV_FILTER_UNSELECTED_REGEX.test(getTrafimageFilter(layer)),
      onClick: (features, layer) =>
        layer.highlightStation(
          features.find((feat) => !!feat.get("direktverbindung_ids")),
        ),
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
    this.viewChangeListener = this.map.on("moveend", () => {
      clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(() => {
        this.syncFeatures();
      }, 400);
    });
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    mbMap.once("idle", () => this.syncFeatures());
  }

  getMapboxFeatures() {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return null;
    }
    const renderedMbFeatures = mbMap.querySourceFeatures(DV_KEY, {
      sourceLayer: DV_TRIPS_SOURCELAYER_ID,
      filter: ["==", "$type", "LineString"],
    });
    renderedMbFeatures.forEach((feat) => {
      feat.source = DV_KEY;
      feat.sourceLayer = DV_TRIPS_SOURCELAYER_ID;
    });
    return renderedMbFeatures || [];
  }

  /**
   * Assigns mapbox features to Cartaro ol features using their ID
   * @returns {array<ol.Feature>} Array of ol features
   */
  syncFeatures() {
    const mbFeatures = this.getMapboxFeatures();
    const cartaroFeatIsMissingMbFeat =
      this.allFeatures?.length &&
      !this.allFeatures.every((feat) => feat.get("mapboxFeature"));
    if (cartaroFeatIsMissingMbFeat && mbFeatures?.length) {
      this.allFeatures.forEach((feat) => {
        const mbFeature = mbFeatures.find(
          (mbFeat) =>
            mbFeat?.properties?.cartaro_id === feat?.get("cartaro_id"),
        );
        if (!feat.get("mapboxFeature")) {
          feat.set("mapboxFeature", mbFeature);
        }
      });
    }
    this.dispatchEvent({
      type: "sync:features",
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
      `${this.mapboxLayer.url}/data/ch.sbb.direktverbindungen.public.json?key=${this.mapboxLayer.apiKey}`,
    )
      .then((res) => res.json())
      .then((data) => {
        this.allFeatures = data["geops.direktverbindungen"].map((line) => {
          return new Feature({
            ...line,
            geometry: new LineString([
              [line.bbox[0], line.bbox[1]],
              [line.bbox[2], line.bbox[3]],
            ]),
          });
        });
        this.syncFeatures();
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }

  /**
   * @returns {array<mapbox.stylelayer>} Array of mapbox style layers
   */
  getDvLayers(regex) {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return null;
    }
    const style = mbMap.getStyle();
    return style?.layers.filter((stylelayer) => {
      return (regex || DV_FILTER_REGEX).test(getTrafimageFilter(stylelayer));
    });
  }

  /**
   * Gets the current visible IPV layer
   * @returns {string} 'day', 'night' or 'all'
   */
  getCurrentLayer() {
    const nightLayer = this.get("nightLayer");
    const dayLayer = this.get("dayLayer");

    if (dayLayer?.get("visible") && nightLayer?.get("visible")) {
      this.visible = true;
      return "all";
    }
    if (dayLayer?.get("visible") || nightLayer?.get("visible")) {
      const visibleLayer = [dayLayer, nightLayer].find((layer) =>
        layer.get("visible"),
      );
      this.visible = true;
      return visibleLayer.get("routeType");
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
    const filterRegex = new RegExp(`^ipv_(${currentLayer})$`);
    this.getDvLayers()?.forEach((stylelayer) => {
      mbMap.setLayoutProperty(
        stylelayer.id,
        "visibility",
        filterRegex.test(getTrafimageFilter(stylelayer)) ? "visible" : "none",
      );
    });
  }

  getLayerOriginalFilter(layerId, filterExpression) {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return null;
    }
    return mbMap?.getFilter(layerId)?.filter((item) => {
      return !(
        Array.isArray(item) &&
        item[1].toString() === filterExpression.toString()
      );
    });
  }

  /**
   * Updates visibility for stations, labels and select highlight mb layers
   * and applies the mb filter for the currently selected feature
   */
  highlightLine() {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    const highlightLayerString = "(edge|station|full)_";
    const callLayersRegex = new RegExp(
      `^ipv_call_(${highlightLayerString})?${this.getCurrentLayer()}$`,
    );
    const callLayers = this.getDvLayers(callLayersRegex);
    const highlightLayersRegex = new RegExp(
      `^ipv_call_${highlightLayerString}${this.getCurrentLayer()}$`,
    );
    // Highlight lines only
    const selectedLines = this.selectedFeatures.filter(
      (feat) =>
        feat.getGeometry() instanceof MultiLineString ||
        feat.getGeometry() instanceof LineString,
    );
    callLayers.forEach((layer) => {
      if (selectedLines.length > 0) {
        mbMap.setLayoutProperty(layer.id, "visibility", "visible");
        if (
          highlightLayersRegex.test(getTrafimageFilter(layer)) ||
          /displace/.test(layer.id)
        ) {
          const idFilterExpression = [
            "get",
            /^symbol$/.test(layer.type) ? "direktverbindung_id" : "id",
          ];
          // Reset filter to original state
          const originalFilter = this.getLayerOriginalFilter(
            layer.id,
            idFilterExpression,
          );
          mbMap.setFilter(layer.id, originalFilter);
          selectedLines
            .filter((feat) => !!feat.get("name"))
            .forEach((feature) => {
              // Add feature id filter
              const featureIdFilter = [
                ...mbMap.getFilter(layer.id),
                ["==", idFilterExpression, feature.get("id")],
              ];
              mbMap.setFilter(layer.id, featureIdFilter);
            });
        }
        if (this.highlightedStation) {
          const fullLayer = this.getDvLayers(
            new RegExp(`^ipv_call_full_${this.getCurrentLayer()}$`),
          )?.[0];
          mbMap.setLayoutProperty(fullLayer.id, "visibility", "none");
        }
      } else {
        mbMap.setLayoutProperty(layer.id, "visibility", "none");
      }
    });
  }

  highlightStation(feature) {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    this.highlightedStation = feature;
    const selectedStationLayer = this.getDvLayers(
      new RegExp(`^ipv_selected_station_${this.getCurrentLayer()}$`),
    )?.[0];
    const idFilterExpression = ["get", "uid"];
    const originalFilter = this.getLayerOriginalFilter(
      selectedStationLayer.id,
      idFilterExpression,
    );
    mbMap.setFilter(selectedStationLayer.id, originalFilter);
    if (this.highlightedStation) {
      mbMap.setLayoutProperty(selectedStationLayer.id, "visibility", "visible");
      // Add feature id filter
      const featureIdFilter = [
        ...mbMap.getFilter(selectedStationLayer.id),
        ["==", idFilterExpression, this.highlightedStation.get("uid")],
      ];
      mbMap.setFilter(selectedStationLayer.id, featureIdFilter);
      const fullLayer = this.getDvLayers(
        new RegExp(`^ipv_call_full_${this.getCurrentLayer()}$`),
      )?.[0];
      mbMap.setLayoutProperty(fullLayer.id, "visibility", "none");
    } else {
      mbMap.setLayoutProperty(selectedStationLayer.id, "visibility", "none");
    }
    this.dispatchEvent({
      type: "select:station",
      feature: this.highlightedStation,
    });
  }

  select(features = []) {
    super.select(features);
    this.highlightLine();
  }
}

export default DirektverbindungenLayer;
