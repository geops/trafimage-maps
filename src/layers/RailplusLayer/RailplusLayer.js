import { LineString } from "ol/geom";
import MapboxStyleLayer from "../MapboxStyleLayer";

/**
 * Layer for RailplusLayer
 * Extends {@link https://mobility-toolbox-js.geops.io/doc/class/build/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class RailplusLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super(options);
    this.abortController = new AbortController();
  }

  onLoad() {
    super.onLoad();
    this.fetchRailplusProviders();
  }

  fetchRailplusProviders() {
    this.abortController.abort();
    this.abortController = new AbortController();
    fetch(
      `${this.mapboxLayer?.url}/data/ch.railplus.betreiberinnen.json?key=${this.mapboxLayer?.apiKey}`,
      { signal: this.abortController.signal },
    )
      .then((res) => res.json())
      .then((data) => {
        this.railplusProviders = data["geops.railplus.tu_info"];
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }

  zoomOnBbox(bbox) {
    if (!bbox) return;
    const geom = new LineString([
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ]);
    this.map.getView().fit(geom.getExtent(), { duration: 1000 });
  }
}

export default RailplusLayer;
