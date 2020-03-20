import React from 'react';
import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { transform } from 'ol/proj';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
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

    // Set the layer initially visible
    // in order to load the data and populate the dropdown
    // Then the visibility is set the the initial value.
    this.initialVisible = this.visible;
    this.setVisible(true);

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

            // Set the visibility to the initial value
            this.setVisible(this.initialVisible);
          });
      },
    });

    olLayer.setSource(this.source);

    this.routes = {};
    this.options = [];
    this.icons = {};
    this.onSelect = this.onSelect.bind(this);
    this.onChangeVisible = this.onChangeVisible.bind(this);
    this.on('change:visible', this.onChangeVisible);
  }

  init(map) {
    super.init(map);

    if (this.map) {
      this.map.on('singleclick', () => this.reset);
    }
  }

  reset() {
    // Deselect map features
    this.onSelect();
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
    this.options.unshift('Alle');

    if (this.comp) {
      this.comp.forceUpdate();
    }
  }

  renderItemContent(comp) {
    this.comp = comp;

    return (
      <select
        disabled={!this.visible}
        className="wkp-zweitausbildung-layer-select"
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

  onChangeVisible() {
    if (this.comp) {
      this.comp.forceUpdate();
    }
  }

  onSelect(evt) {
    for (let i = 0; i < this.features.length; i += 1) {
      const label = this.features[i].get('label');
      this.features[i].set(
        'highlight',
        evt ? label === evt.target.value : false,
      );
    }

    this.olLayer.changed();
    if (this.comp) {
      this.comp.forceUpdate();
    }
  }

  getFeatureInfoAtCoordinate(coordinate) {
    const layer = this;
    const meterRad = 1000;
    // TODO Eva meterRad von zoom abhängig
    // const meterRad = z > 11 100 : 1000;

    const [newX, newY] = transform(
      [parseInt(coordinate[0], 10), parseInt(coordinate[1], 10)],
      'EPSG:3857',
      'EPSG:21781',
    );

    return fetch(
      `${this.geoServerUrl}?` +
        'service=WFS&version=1.0.0&request=GetFeature&' +
        `typeName=trafimage:${this.zweitProps.featureInfoLayer}&` +
        // 'srsName=EPSG:3857&' +
        'maxFeatures=50&' +
        'outputFormat=application/json&' +
        `viewparams=x:${parseInt(newX, 10)};y:${parseInt(
          newY,
          10,
        )};r:${meterRad}`,
    )
      .then(data => data.json())
      .then(data => {
        const format = new GeoJSON();
        const feats = format.readFeatures(data);

        const features = [];
        if (feats.length) {
          features.push(
            new Feature({
              geometry: new Point(coordinate),
              features: feats,
              highlightFeatures: layer.features,
            }),
          );
        }

        return {
          features,
          layer,
          coordinate,
        };
      });
  }

  setGeoJsonUrl(geoJsonCacheUrl) {
    this.geoJsonCacheUrl = geoJsonCacheUrl;
  }

  setGeoServerUrl(geoServerUrl) {
    this.geoServerUrl = geoServerUrl;
  }

  style(feature, resolution) {
    if (feature.get('highlight')) {
      const color = feature.get('color') || 'rgba(50, 50, 50, 0.8)';
      const network = feature.get('network');

      const currentNetwork = `trackit${layerHelper.getOldGeneralization(
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
