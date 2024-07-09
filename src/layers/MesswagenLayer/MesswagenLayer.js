import { Layer } from "mobility-toolbox-js/ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import { fromLonLat } from "ol/proj";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import pin from "../../img/sbb/location-pin-m-medium-bg-red.url.svg";

const style = new Style({
  image: new Icon({
    src: pin,
    scale: 1.5,
    anchor: [0.5, 30],
    anchorYUnits: "pixels",
  }),
});

class MesswagenLayer extends Layer {
  constructor(options = {}) {
    super({
      ...options,
      olLayer: new VectorLayer({
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        source: new VectorSource({
          features: [],
        }),
        style,
      }),
      properties: {
        follow: true,
        ...(options?.properties || {}),
      },
    });
  }

  attachToMap(map) {
    super.attachToMap(map);

    if (this.visible) {
      this.start();
    }

    this.olEventsKeys.push(
      this.olLayer.on("change:visible", () => {
        if (this.visible) {
          this.start();
        } else {
          this.stop();
        }
      }),
      this.on("change:feature", (evt) => {
        const feature = this.get(evt.key);

        if (feature && this.get("follow")) {
          const size = map.getSize();
          const extent = map
            .getView()
            .calculateExtent([size[0] - 200, size[1] - 400]);
          if (!feature.getGeometry().intersectsExtent(extent)) {
            this.centerOn(feature, undefined);
          }

          if (feature && !evt.oldValue) {
            this.centerOn(feature, 17);
          }
        }
      }),
    );
  }

  detachFromMap(map) {
    this.stop();
    this.olLayer.getSource().clear();
    super.detachFromMap(map);
  }

  start() {
    if (!this.get("fileName")) return;
    const feature = this.get("feature");
    if (feature) {
      this.centerOn(feature);
    }
    this.stopped = false;
    this.updateData();
  }

  stop() {
    this.stopped = true;
    this.abortController?.abort();
    clearTimeout(this.abortTimeout);
    clearTimeout(this.timeout);
  }

  updateData() {
    this.abortController?.abort();

    this.abortController = new AbortController();

    // Auto abort when request takes too long
    clearTimeout(this.abortTimeout);
    this.abortTimeout = setTimeout(() => {
      this.abortController.abort();
    }, 10000);

    // We put it in a variable for easy testing.
    this.fetch = fetch(
      `https://trafimage-services1.geops.de/messwagen/${this.get(
        "fileName",
      )}.json`,
      {
        signal: this.abortController.signal,
      },
    )
      .then((response) => response.json())
      .then((data) => {
        this.olLayer.getSource().clear();
        if (data?.latitude && data?.longitude) {
          const feature = new Feature({
            geometry: new Point(fromLonLat([data.longitude, data.latitude])),
            ...data,
          });
          this.olLayer.getSource().addFeatures([feature]);
          this.set("feature", feature);
        }
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(this.abortTimeout);
        clearTimeout(this.timeout);

        // The finally occurs asynchronously when we call the abort in stop().
        // So we have to recheck if the layer is stopped or not.
        if (!this.stopped) {
          // Update data in one second
          this.timeout = setTimeout(() => {
            this.updateData();
          }, 1000);
        }
      });
  }

  centerOn(feature, zoom) {
    const center = feature?.getGeometry()?.getCoordinates();
    if (center) {
      this.map?.getView().cancelAnimations();
      this.map?.getView().animate({
        center,
        zoom,
      });
    }
  }
}
export default MesswagenLayer;
