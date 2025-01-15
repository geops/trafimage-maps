/* eslint-disable class-methods-use-this */
import { MapboxStyleLayer } from "mobility-toolbox-js/ol";
import { Feature } from "ol";

/**
 * Layer for kilometrage popup
 * Extends {@link https://mobility-toolbox-js.geops.io/doc/class/build/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
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
        useOverlay: false,
        popupComponent: "KilometragePopup",
        ...(options || {}).properties,
      },
    });
    this.abortController = new AbortController();
  }

  fetchKilometrage(coordinate, lines, generalization) {
    this.abortController?.abort();
    this.abortController = new AbortController();
    return fetch(
      `${this.searchUrl}/search/measure?coords=${coordinate}&generalization_level=${generalization}&lines=${lines.toString()}`,
      { signal: this.abortController.signal },
    )
      .then((data) => data.json())
      .then((data) => {
        if (data.error || data.detail || !data.length) {
          return { features: [], layer: this, coordinate };
        }
        return {
          features: [
            new Feature({
              lines: data,
            }),
          ],
          layer: this,
          coordinate,
        };
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Could not fetch kilometrage data", error);
        return { features: [], layer: this, coordinate };
      });
  }

  getFeatureInfoAtCoordinate(coordinate, eventType) {
    return super.getFeatureInfoAtCoordinate(coordinate).then((info) => {
      const { features } = info;

      const lines = features.reduce((all, current) => {
        const lineNumber = current.get("line_number");
        return lineNumber && !all.includes(lineNumber)
          ? [...all, lineNumber]
          : all;
      }, []);
      const generalization = features
        .find((feat) => feat.get("line_number"))
        ?.get("generalization_level");

      return eventType === "singleclick" && lines.length
        ? this.fetchKilometrage(coordinate, lines, generalization)
        : {
            features: lines.length ? [new Feature()] : [], // Return empty feature for cursor style
            layer: this,
            coordinate,
          };
    });
  }

  setSearchUrl(searchUrl) {
    this.searchUrl = searchUrl;
  }

  highlight() {} // Omit highlight

  select() {} // Omit select
}

export default KilometrageLayer;
