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
import IconList from '../../components/IconList';

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
      source: new OLVectorSource({
        format: new GeoJSON(),
      }),
    });

    super({
      ...options,
      olLayer,
    });

    this.styleCache = {};
    this.zweitProps = this.get('zweitausbildung') || {};

    this.setVisible(this.visible);

    this.routes = {};
    this.options = [];
    this.icons = {};
    this.reset = this.reset.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onChangeVisible = this.onChangeVisible.bind(this);
    this.on('change:visible', this.onChangeVisible);
  }

  init(map) {
    super.init(map);

    if (this.map) {
      this.map.on('singleclick', this.reset);
    }
  }

  reset() {
    // Deselect map features
    this.onSelect();
  }

  /**
   * Load the data independently from the vector source loader
   * to make sure that the dropdown is always popuplated,
   * even when the layer is invisible, e.g. because of the permalink.
   */
  load() {
    const layerParam = this.zweitProps.layer
      ? `layer=${this.zweitProps.layer}&`
      : '';

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
        this.icons[label] = feature.get('line_number')
          ? `${
              process.env.REACT_APP_STATIC_FILES_URL
            }/img/layers/zweitausbildung/${feature.get('line_number')}.png`
          : null;
      }
    }

    this.options = this.options.sort((a, b) => a.localeCompare(b));
    this.options.unshift('Alle');

    this.rerenderList();
  }

  rerenderList() {
    if (this.comp) {
      this.comp.forceUpdate();
    }
  }

  renderItemContent(comp) {
    this.comp = comp;

    if (this.options && this.options.length) {
      return (
        <IconList
          disabled={!this.visible}
          options={this.options}
          selected={this.selected}
          icons={this.icons}
          onSelect={this.onSelect}
        />
      );
    }

    return null;
  }

  onChangeVisible() {
    this.rerenderList();
  }

  onSelect(option) {
    this.selected = option;
    for (let i = 0; i < this.features.length; i += 1) {
      const label = this.features[i].get('label');
      this.features[i].set('highlight', option ? label === option : false);
    }

    this.olLayer.changed();
  }

  getFeatureInfoAtCoordinate(coordinate) {
    const layer = this;
    const meterRad = this.map && this.map.getView().getZoom() > 11 ? 100 : 1000;

    const [newX, newY] = transform(
      [parseInt(coordinate[0], 10), parseInt(coordinate[1], 10)],
      'EPSG:3857',
      'EPSG:21781',
    );

    return fetch(
      `${this.geoServerUrl}?` +
        'service=WFS&version=1.0.0&request=GetFeature&' +
        `typeName=trafimage:${this.zweitProps.featureInfoLayer}&` +
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
    this.load();
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

      // Update the selected option
      this.selected = feature.get('label');
      this.rerenderList();

      return this.styleCache[styleName];
    }

    // Update the selected option
    // if no features is highlighted so far
    let selectedFeature = null;
    for (let i = 0; i < this.features.length; i += 1) {
      if (this.features[i].get('highlight')) {
        selectedFeature = this.features[i].get('highlight');
      }
    }
    if (!selectedFeature) {
      this.selected = null;
      this.rerenderList();
    }

    return null;
  }
}

export default ZweitausbildungRoutesHighlightLayer;
