/* eslint-disable class-methods-use-this */
import { MapboxStyleLayer } from "mobility-toolbox-js/ol";
import { Feature } from "ol";

/**
 * Layer for kilometrage popup
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/Layer%20js~Layer%20html}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class KilometrageLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super({
      name: "ch.sbb.kilometrage",
      key: "ch.sbb.kilometrage",
      queryRenderedLayersFilter: ({ type, source }) =>
        type === "line" && source === "base",
      visible: true,
      ...options,
      properties: {
        isQueryable: true,
        hideInLegend: true,
        featureInfoEventTypes: ["singleclick"],
        useOverlay: false,
        popupComponent: "KilometragePopup",
        ...(options || {}).properties,
      },
    });
  }

  getFeatureInfoAtCoordinate(coordinate) {
    return super.getFeatureInfoAtCoordinate(coordinate).then((info) => {
      const { features } = info;

      const lines = features.reduce(
        (all, current) =>
          current.get("line_number")
            ? [...all, current.get("line_number")]
            : all,
        [],
      );
      const generalization = features
        .find((feat) => feat.get("line_number"))
        ?.get("generalization_level");

      return fetch(
        `${this.searchUrl}/search/measure?coords=${coordinate}&generalization_level=${generalization}&lines=${lines.toString()}`,
      )
        .then((data) => data.json())
        .then((data) => {
          if (data.error || data.detail) {
            return { features: [], layer: this, coordinate };
          }

          const kilometrageFeatures = Array.from(
            new Set(data.map((obj) => JSON.stringify(obj))),
          )
            .map((str) => JSON.parse(str))
            .map((i) => new Feature(i));

          return {
            features: kilometrageFeatures,
            layer: this,
            coordinate,
          };
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.error("Kilometrage request needs CORS to work properly");
          return { features: [], layer: this, coordinate };
        });
    });
  }

  setSearchUrl(searchUrl) {
    this.searchUrl = searchUrl;
  }

  highlight() {} // Omit highlight

  select() {} // Omit select
}

export default KilometrageLayer;
