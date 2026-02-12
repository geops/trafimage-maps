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
class DirektverbindungenSingleLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super({
      ...options,
    });
  }

  onLoad() {
    super.onLoad();
  }

  /**
   * Fetch features from Cartaro for the list view
   */
  async fetchDvFeatures() {
    try {
      if (!this.mapboxLayer?.url || !this.mapboxLayer?.apiKey) {
        // eslint-disable-next-line no-console
        throw new Error("DirektVerbindungLayer: No url or apiKey defined.");
      }
      const response = await fetch(
        `${this.mapboxLayer.url}/data/ch.sbb.direktverbindungen.public.json?key=${this.mapboxLayer.apiKey}`,
      );
      const data = await response.json();
      this.allLines = data["geops.direktverbindungen"];
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  attachToMap(map) {
    super.attachToMap(map);
    this.fetchDvFeatures();
  }

  detachFromMap() {
    super.detachFromMap();
    unByKey(this.viewChangeListener);
  }

  highlightLine(cartaroId) {
    this.mapboxLayer?.mbMap?.getStyle()?.layers?.forEach((layer) => {
      if (this.styleLayersFilter(layer)) {
        this.mapboxLayer?.mbMap?.setFilter(layer.id, [
          "any",
          ["==", ["get", "cartaro_id"], cartaroId],
          ["==", ["get", "direktverbindung_cartaro_id"], cartaroId],
        ]);
      }
    });
  }
}

export default DirektverbindungenSingleLayer;
