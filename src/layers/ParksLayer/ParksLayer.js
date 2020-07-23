import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import MultiPolygon from 'ol/geom/MultiPolygon';
import { transform } from 'ol/proj';
import { Fill, Stroke, Style } from 'ol/style';
import TrafimageGeoServerWMSLayer from '../TrafimageGeoServerWMSLayer';

class ParksLayer extends TrafimageGeoServerWMSLayer {
  constructor(options = {}) {
    super({
      ...options,
    });
    this.dataProjection = 'EPSG:21781';
    this.featureProjection = 'EPSG:3857';
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
    return fetch(this.getFeatureInfoUrl(coordinate))
      .then((resp) => resp.json())
      .then((r) => r.features)
      .then((data) => {
        const dataFeats = data.map((feat) => {
          const multipolygon = [];
          // Read the features, transform their coordinates to highlight the hovered feature.
          feat.geometry.coordinates.forEach((coords) => {
            const polygon = coords[0].map((c) => {
              const transformedCoord = transform(
                c,
                this.dataProjection,
                this.featureProjection,
              );
              return transformedCoord;
            });
            multipolygon.push([polygon]);
          });
          const newFeature = new Feature({
            geometry: new MultiPolygon(multipolygon),
          });
          newFeature.setId(feat.id);
          newFeature.setProperties(feat.properties);
          return newFeature;
        });

        this.vectorLayer.getSource().clear();
        this.vectorLayer.getSource().addFeatures(dataFeats);

        return {
          layer: this,
          coordinate,
          features: data.map((d) => this.format.readFeature(d)),
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
