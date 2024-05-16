import qs from "query-string";
import MapboxStyleLayer from "../MapboxStyleLayer";

/**
 * Layer for ausbau
 * Extends {@link https://mobility-toolbox-js.geops.io/doc/class/build/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class AusbauLayer extends MapboxStyleLayer {
  static updateUrl(filterValue) {
    const params = qs.parse(window.location.search);

    if (filterValue) {
      params.showFilter = filterValue;
      window.history.replaceState(
        undefined,
        undefined,
        `${window.location.pathname}?${qs.stringify(params)}`,
      );
    } else {
      params.showFilter = "true";
    }
  }

  constructor(options = {}) {
    super(options);

    this.initialFiltersById = {};

    this.showFilterParam = qs.parse(window.location.search).showFilter;

    // List of filters availables
    this.filters = [
      { value: "", key: "Projekte im Bau" },
      { value: "2030", key: "Fertigstellung bis 2030" },
      { value: "2035", key: "Fertigstellung bis 2035" },
    ];
    this.filter =
      this.filters.find((filter) => filter.value === this.showFilterParam) ||
      this.filters[0];
  }

  addDynamicFilters() {
    this.applyNewFilter(this.filter.value);
  }

  applyNewFilter(filterValue) {
    const { maplibreMap } = this.mapboxLayer;
    const style = maplibreMap.getStyle();
    if (!maplibreMap || !style) {
      return;
    }
    this.filter = this.filters.find((filter) => filter.value === filterValue);
    const filterToApply = filterValue !== undefined && [
      "==",
      filterValue,
      ["get", "angebotsschritt"],
    ];

    style.layers.forEach(({ id }) => {
      // This filter must affect only Ausbau layers.
      if (!/ausbau/.test(id)) {
        return;
      }

      // Store the initial filter values for each style layer.
      if (!this.initialFiltersById[id]) {
        this.initialFiltersById[id] = maplibreMap.getFilter(id) || [];
      }

      let newFilter = this.initialFiltersById[id].length
        ? [...this.initialFiltersById[id]]
        : null;

      if (!newFilter && filterToApply) {
        newFilter = ["all", filterToApply];
      } else if (filterToApply && newFilter[0] === "all") {
        // we assume the filter is defined with 'all' keyword
        // ['all', filter1, filter2]
        newFilter.push(filterToApply);
      }
      maplibreMap.setFilter(id, newFilter);
    });

    // Update showFilter parameter
    AusbauLayer.updateUrl(filterValue);
  }
}

export default AusbauLayer;
