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

    this.olListenersKeys.push(
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

    this.updateData();

    this.interval = window.setInterval(() => {
      this.updateData();
    }, 1000);
  }

  stop() {
    this.abortController?.abort();
    clearInterval(this.interval);
  }

  updateData() {
    this.abortController?.abort();

    this.abortController = new AbortController();
    fetch(
      `https://trafimage-services1.geops.de/messwagen/${this.get("fileName")}.json`,
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
      .catch(() => {});
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
