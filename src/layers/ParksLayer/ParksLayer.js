import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from 'ol/style';
import TrafimageGeoServerWMSLayer from '../TrafimageGeoServerWMSLayer';

/**
 * Layer for visualizing swiss park and highlight them on pointermove.
 * @private
 */
class ParksLayer extends TrafimageGeoServerWMSLayer {
  constructor(options = {}) {
    super({
      ...options,
    });
    this.abortController = new AbortController();

    this.format = new GeoJSON({
      dataProjection: 'EPSG:21781',
      featureProjection: 'EPSG:3857',
    });

    // Tile layer to display the features.
    this.tileLayer = this.olLayer
      .getLayers()
      .getArray()
      .find((l) => l instanceof TileLayer);
    // Vector layer to highlight the hovered feature.
    this.vectorLayer = this.olLayer
      .getLayers()
      .getArray()
      .find((l) => l instanceof VectorLayer);
    this.vectorLayer.setStyle(
      new Style({
        stroke: new Stroke({
          color: 'rgba(130,148,77, 0.8)',
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(130,148,77, 0.2)',
        }),
      }),
    );
  }

  setGeoServerWMSUrl(geoServerUrl) {
    this.tileLayer.getSource().setUrl(geoServerUrl);
  }

  getFeatureInfoUrl(coord) {
    const projection = this.map.getView().getProjection();
    const resolution = this.map.getView().getResolution();

    if (this.tileLayer.getSource().getFeatureInfoUrl) {
      return this.tileLayer
        .getSource()
        .getFeatureInfoUrl(coord, resolution, projection, {
          info_format: 'application/json',
          query_layers: this.tileLayer.getSource().getParams().layers,
        });
    }
    return false;
  }

  getFeatureInfoAtCoordinate(coordinate) {
    this.abortController.abort();
    this.abortController = new AbortController();
    const { signal } = this.abortController;
    return fetch(this.getFeatureInfoUrl(coordinate), { signal })
      .then((resp) => resp.json())
      .then((response) => {
        const dataFeats = response.features.map((feature) =>
          this.format.readFeature(feature),
        );
        this.vectorLayer.getSource().clear();
        this.vectorLayer.getSource().addFeatures(dataFeats);

        return {
          layer: this,
          coordinate,
          features: dataFeats,
        };
      })
      .catch(() => {
        // resolve an empty feature array something fails
        return Promise.resolve({
          features: [],
          coordinate,
          layer: this,
        });
      });
  }
}

export default ParksLayer;
