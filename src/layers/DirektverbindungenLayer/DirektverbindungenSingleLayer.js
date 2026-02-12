import VectorSource from "ol/source/Vector";
import DirektverbindungenLayer from ".";

/**
 * Layer for visualizing international train connections by name
 *
 * @class
 * @param {Object} [options] Layer options.
 * @inheritdoc
 * @private
 */
class DirektverbindungenSingleLayer extends DirektverbindungenLayer {
  /**
   * This function try to find fetaures to select on loading the page based a the line name.
   */
  getFeaturesInfosFromLineName(lineName) {
    const names = lineName?.split(",");
    if (!names?.length) {
      return Promise.resolve([]);
    }

    const getFeatureInfo = (features) => {
      const found = features.filter((feature) => {
        console.log("select cartaroIds", lineName, feature.get("name"));

        return (
          feature.get("name") === lineName ||
          feature.get("cartaro_id") === Number(lineName)
        );
      });
      return [
        {
          features: found,
          layer: this,
        },
      ];
    };

    if (this.allFeatures?.length) {
      return Promise.resolve(getFeatureInfo(this.allFeatures));
    }

    const promise = new Promise((resolve) => {
      this.on("sync:features", ({ features = [] }) => {
        resolve(getFeatureInfo(features));
      });
    });
    return promise;
  }

  // eslint-disable-next-line class-methods-use-this
  highlight() {}

  select(features = []) {
    const cartaroIds = features.map(
      (feat) =>
        feat.get("cartaro_id") || feat.get("direktverbindung_cartaro_id"),
    );
    if (cartaroIds.length) {
      console.log("select cartaroIds", cartaroIds);

      console.log(
        " this.mapboxLayer?.mbMap",
        this.mapboxLayer?.mbMap.getStyle(),
      );

      const applyFilter = () => {
        this.mapboxLayer?.mbMap?.getStyle()?.layers?.forEach((layer) => {
          if (this.styleLayersFilter(layer)) {
            this.mapboxLayer?.mbMap?.setFilter(layer.id, [
              "any",
              ...cartaroIds.map((id) => ["==", ["get", "cartaro_id"], id]),
              ...cartaroIds.map((id) => [
                "==",
                ["get", "direktverbindung_cartaro_id"],
                id,
              ]),
            ]);
          }
        });
      };

      const style = this.mapboxLayer?.mbMap?.getStyle();
      if (!style) {
        this.mapboxLayer?.mbMap?.once("idle", () => {
          applyFilter();
        });
      }

      const source = new VectorSource({ features });
      const extent = source.getExtent();
      this.map.getView().fit(extent, {
        padding: [100, 100, 100, 100],
      });
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getCurrentLayer() {}

  // eslint-disable-next-line class-methods-use-this
  highlightStation() {}
}

export default DirektverbindungenSingleLayer;
