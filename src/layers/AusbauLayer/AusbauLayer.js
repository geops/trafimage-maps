import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';
import qs from 'query-string';

/**
 * Layer for ausbau
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/VectorLayer%20js~VectorLayer%20html}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class AusbauLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super(options);

    this.initialFiltersById = {};

    // Define if we apply filters or not
    this.isShowFilter = qs.parse(window.location.search).showFilter === 'true';
    this.defaultFilter = ['==', '', ['get', 'angebotsschritt']];
  }

  addDynamicFilters() {
    if (!this.isShowFilter) {
      return;
    }

    this.applyNewFilter(this.defaultFilter);
  }

  applyNewFilter(filterToApply) {
    const { mbMap } = this.mapboxLayer;
    const style = mbMap.getStyle();
    if (!mbMap || !style) {
      return;
    }

    style.layers.forEach(({ id }) => {
      // console.log(id, mbMap.getFilter(id));

      // This filter must affect nur Ausbau layers.
      if (!/ausbau/.test(id)) {
        return;
      }

      // Store the initial filter values for each style layer.
      if (!this.initialFiltersById[id]) {
        this.initialFiltersById[id] = mbMap.getFilter(id) || [];
      }

      let newFilter = this.initialFiltersById[id].length
        ? [...this.initialFiltersById[id]]
        : null;

      if (!newFilter && filterToApply) {
        newFilter = ['all', filterToApply];
      } else if (filterToApply && newFilter[0] === 'all') {
        // we assume the filter is defined with 'all' keyword
        // ['all', filter1, filter2]
        newFilter.push(filterToApply);
      }
      mbMap.setFilter(id, newFilter);
    });
  }
}

export default AusbauLayer;
