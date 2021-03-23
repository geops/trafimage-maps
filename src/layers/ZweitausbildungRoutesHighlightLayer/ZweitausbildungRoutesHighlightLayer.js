import React from 'react';
import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';
import IconList from '../../components/IconList';
import lines from '../ZweitausbildungRoutesLayer/lines.json';

const sourceId = 'base';
const sourceLayer = 'osm_edges';

/**
 * Layer for zweitausbildung highlight routes.
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class ZweitausbildungRoutesHighlightLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    const { property } = options.properties.zweitausbildung;
    // Here we set an empty styleLayer so the MapboxStyleLayer.getFeatureAtCoordinate methode
    // can use the source and the source-layer properties.
    super({
      ...options,
      styleLayer: {
        id: options.key || options.name,
        type: 'line',
        source: sourceId,
        'source-layer': sourceLayer,
        paint: {
          'line-color': 'rgba(0,0,0,0)',
          'line-width': 10,
        },
      },
      queryRenderedLayersFilter: (layer) => {
        return (
          layer.filter &&
          layer.filter[0] === 'has' &&
          layer.filter[1] === property
        );
      },
    });

    this.property = property;
    this.icons = {};
    this.onSelect = this.onSelect.bind(this);
    this.populate();
  }

  /**
   * @override
   */
  init(map) {
    super.init(map);

    if (this.map) {
      /**
       * Remove highlighted line on click on the map.
       */
      this.olListenersKeys.push(
        this.map.on('singleclick', () => {
          this.onSelect();
          this.forceRenderList();
        }),
      );
    }
  }

  /**
   * Add options to the select box.
   */
  populate() {
    this.options = [];
    Object.entries(lines).forEach(([label, { shortname }]) => {
      if (this.options.indexOf(label) === -1) {
        this.options.push(label);
        this.icons[label] = shortname
          ? `${this.staticFilesUrl}/img/layers/zweitausbildung/${shortname}.png`
          : null;
      }
    });
    this.options = this.options.sort((a, b) => a.localeCompare(b));
    this.options.unshift('Alle');
  }

  /**
   * Render the select box.
   */
  renderItemContent(comp) {
    if (!this.options || !this.options.length) {
      return null;
    }

    return (
      <IconList
        ref={(el) => {
          this.iconListComp = el;
        }}
        t={comp.props.t}
        disabled={!this.visible}
        options={this.options}
        selected={this.selected}
        icons={this.icons}
        onSelect={this.onSelect}
      />
    );
  }

  /**
   * Force to render the list with the selected value.
   */
  forceRenderList() {
    if (this.iconListComp) {
      this.iconListComp.select(this.selected);
    }
  }

  /**
   * Calback when a new value is selected in the select box.
   */
  onSelect(option) {
    this.selected = option;

    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    mbMap.setPaintProperty(this.key, 'line-color', 'rgba(0,0,0,0)');
    if (this.selected) {
      this.highlightLine();
    }
  }

  /**
   * Highlight the line selected in the select box.
   */
  highlightLine() {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }

    const color = lines[this.selected]?.color;
    if (!color) {
      // eslint-disable-next-line no-console
      console.log(
        `There is no color defined for ${this.selected}, available labels are `,
        lines,
      );
      return;
    }

    if (mbMap.getLayer(this.key)) {
      mbMap.setPaintProperty(this.key, 'line-color', [
        'case',
        ['in', this.selected, ['get', this.property]],
        color,
        'rgba(0,0,0,0)',
      ]);
    }
  }

  setStaticFilesUrl(staticFilesUrl) {
    if (this.staticFilesUrl !== staticFilesUrl) {
      this.staticFilesUrl = staticFilesUrl;
      this.populate();
    }
  }
}

export default ZweitausbildungRoutesHighlightLayer;
