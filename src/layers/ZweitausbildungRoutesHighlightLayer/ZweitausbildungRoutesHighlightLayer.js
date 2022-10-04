import React from 'react';
import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';
import IconList from '../../components/IconList';
import lines from '../ZweitausbildungRoutesLayer/lines';

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
    const defautStyle = {
      type: 'line',
      paint: {
        'line-color': 'rgba(0,0,0,0)',
        'line-width': 10,
      },
      layout: {
        'line-cap': 'round',
      },
    };
    const { property } = options.properties.zweitausbildung;
    const styleLayers = [
      {
        ...defautStyle,
        id: options.key || options.name,
        source: sourceId,
        'source-layer': sourceLayer,
      },
    ];

    // if a line has others sources to add, we add the corresponding highlight layer now.
    Object.values(lines).forEach(
      ({ property: prop, extraSources, extraStyleLayers = [] }) => {
        if (prop !== property || !extraSources) {
          return;
        }
        Object.keys(extraSources).forEach((key, index) => {
          styleLayers.push({
            ...defautStyle,
            id: options.key || options.name + key,
            source: key,
            ...(extraStyleLayers[index] || {}),
          });
        });
      },
    );

    super({
      ...options,
      styleLayers,
      queryRenderedLayersFilter: (layer) => {
        return (
          layer.filter &&
          layer.filter[0] === 'has' &&
          layer.filter[1] === property
        );
      },
    });

    this.property = property;
    this.lines = lines; // useful for the popup
    this.icons = {};
    this.onSelect = this.onSelect.bind(this);
    this.populate();
  }

  /**
   * @override
   */
  attachToMap(map) {
    super.attachToMap(map);

    if (this.map) {
      /**
       * Remove highlighted line on click on the map.
       * @ignore
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
    this.selectOptions = [];
    Object.entries(lines).forEach(([label, { property, shortname }]) => {
      if (property !== this.property) {
        return;
      }
      if (this.selectOptions.indexOf(label) === -1) {
        this.selectOptions.push(label);
        this.icons[label] = shortname
          ? `${this.staticFilesUrl}/img/layers/zweitausbildung/${shortname}.png`
          : null;
      }
    });
    this.selectOptions = this.selectOptions.sort((a, b) => a.localeCompare(b));
    this.selectOptions.unshift('Alle');
  }

  /**
   * Render the select box.
   */
  renderItemContent(comp) {
    if (!this.selectOptions || !this.selectOptions.length) {
      return null;
    }

    return (
      <IconList
        ref={(el) => {
          this.iconListComp = el;
        }}
        t={comp.props.t}
        disabled={!this.visible}
        options={this.selectOptions}
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
    this.styleLayers.forEach(({ id }) => {
      mbMap.setPaintProperty(id, 'line-color', 'rgba(0,0,0,0)');
    });

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

    const { color } = lines[this.selected] || {};
    if (!color) {
      if (this.selected !== 'Alle') {
        // eslint-disable-next-line no-console
        console.log(
          `There is no color defined for ${this.selected}, available labels are `,
          lines,
        );
      }
      return;
    }

    this.styleLayers.forEach(({ id }) => {
      mbMap.setPaintProperty(id, 'line-color', [
        'case',
        ['in', this.selected, ['get', this.property]],
        color,
        'rgba(0,0,0,0)',
      ]);
    });
  }

  setStaticFilesUrl(staticFilesUrl) {
    if (this.staticFilesUrl !== staticFilesUrl) {
      this.staticFilesUrl = staticFilesUrl;
      this.populate();
    }
  }
}

export default ZweitausbildungRoutesHighlightLayer;
