import React from 'react';
import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import layerHelper from '../layerHelper';

import './ZweitausbildungRoutesHighlightLayer.scss';

/**
 * Layer for zweitausbildung highlight routes
 * Extends {@link https://react-spatial.geops.de/docjs.html#layer geops-spatial/Layer}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class ZweitausbildungRoutesHighlightLayer extends VectorLayer {
  constructor(options = {}) {
    const olLayer = new OLVectorLayer({
      style: (f, r) => this.style(f, r),
    });

    super({
      ...options,
      olLayer,
    });

    this.styleCache = {};
    this.setVisible(this.visible);

    this.zweitProps = this.get('zweitausbildung') || {};
    const layerParam = this.zweitProps.layer
      ? `layer=${this.zweitProps.layer}&`
      : '';

    this.source = new OLVectorSource({
      format: new GeoJSON(),
      loader: () => {
        fetch(
          `${this.geoJsonCacheUrl}?` +
            `${layerParam}workspace=trafimage` +
            '&srsName=EPSG:3857&geoserver=wkp',
        )
          .then(data => data.json())
          .then(data => {
            const format = new GeoJSON();
            this.features = format.readFeatures(data);
            this.olLayer.getSource().clear();
            this.olLayer.getSource().addFeatures(this.features);

            this.populate();
          });
      },
    });

    olLayer.setSource(this.source);

    this.routes = {};
    this.options = [];
    this.icons = {};
    this.onSelect = this.onSelect.bind(this);
  }

  populate() {
    this.options = [];
    for (let i = 0; i < this.features.length; i += 1) {
      const feature = this.features[i];

      // viadescription for tourist routes
      // description for hauptlinien
      const description =
        feature.get('viadescription') || feature.get('description');
      const desc = description ? `: ${description}` : '';
      const label = `${feature.get('bezeichnung')}${desc}`;

      this.features[i].set('label', label);
      if (this.options.indexOf(label) === -1) {
        this.options.push(label);
        this.icons[label] = feature.get('line_number');
      }
    }

    this.options = this.options.sort((a, b) => a.localeCompare(b));

    // All
    // TODO Eva Translate Alle
    this.options.unshift('Alle');

    if (this.comp) {
      this.comp.forceUpdate();
    }
  }

  renderItemContent(comp) {
    this.comp = comp;
    // TODO Layer ausgrauen, wenn anderer Radio-Button aktiviert ist
    // TODO Eva icons integrieren

    /*
    <img
              src={`${process.env.REACT_APP_STATIC_FILES_URL}/img/layers/zweitausbildung/${this.icons[option]}.png`}
              draggable="false"
              // alt={t('Kein Bildtext')}
              height="16" width="42" style="margin-right: 5px;"
            />

    */

    return (
      /*
      <ul>
        {this.options.map(option => (
          <li>

            {option}
          </li>
        ))}
      </ul>
      */

      <select
        className="wkp-zweitausbildung-layer-select"
        // value={this.route.value}
        onChange={this.onSelect}
      >
        {this.options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  onSelect(evt) {
    for (let i = 0; i < this.features.length; i += 1) {
      const label = this.features[i].get('label');
      this.features[i].set('highlight', label === evt.target.value);
    }

    this.olLayer.changed();
    this.comp.forceUpdate();
  }

  // getFeatureInfoAtCoordinate(coordinate) {

  // }

  setGeoJsonUrl(geoJsonCacheUrl) {
    this.geoJsonCacheUrl = geoJsonCacheUrl;
  }

  style(feature, resolution) {
    if (feature.get('highlight')) {
      const color = feature.get('color') || 'rgba(50, 50, 50, 0.8)';
      const network = feature.get('network');

      const currentNetwork = `trackit${layerHelper.getGeneralization(
        resolution,
      )}`;
      const visible = network === currentNetwork;

      const styleName = visible ? color : visible;

      if (!this.styleCache[styleName]) {
        if (visible) {
          this.styleCache[styleName] = new Style({
            stroke: new Stroke({
              color,
              width: 8,
            }),
          });
        } else {
          this.styleCache[styleName] = new Style();
        }
      }

      return this.styleCache[styleName];
    }
    return null;
  }
}

export default ZweitausbildungRoutesHighlightLayer;
