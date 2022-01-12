import React from 'react';
import { Style, Circle, Fill, Stroke as OLStroke } from 'ol/style';
import {
  MultiLineString,
  GeometryCollection,
  MultiPoint,
  Point,
} from 'ol/geom';
import GeoJSON from 'ol/format/GeoJSON';

import Search from '../Search';
import getGreaterNumber from '../../utils/getGreaterNumber';

const lineMeasuresRegExp = new RegExp(
  '([0-9]*)\\s*([0-9]+\\.?[0-9]*)\\-([0-9]*\\.?[0-9]*)',
);

const lineKilometerRegExp = new RegExp(
  '^([0-9]+)(\\s)(\\+)?(\\s+)?([0-9]+(\\.[0-9]+)?)$',
);

const color = 'rgba(0,61,155,0.5)';

const genLevelByMapRes = {
  21685.61508959875: 5, // zoom 0
  611.49622628141: 10, // zoom 8
  305.748113140705: 30, // zoom 9
  76.43702828517625: 100, // zoom 11
};

class Lines extends Search {
  constructor() {
    super();
    this.dataProjection = 'EPSG:21781';

    this.highlightStyle = (feature, resolution) => {
      const dataRes = getGreaterNumber(
        resolution,
        Object.keys(genLevelByMapRes),
      );
      const gen = genLevelByMapRes[dataRes];
      const format = new GeoJSON();
      const geometry =
        format.readGeometry(feature.get('geoms')[gen], {
          dataProjection: this.dataProjection,
          featureProjection: 'EPSG:3857',
        }) || feature.getGeometry();

      return geometry instanceof MultiLineString ||
        geometry instanceof GeometryCollection
        ? new Style({
            geometry,
            stroke: new OLStroke({
              color,
              width: 10,
            }),
            image:
              geometry.getGeometries &&
              geometry
                .getGeometries()
                .find(
                  (geom) => geom instanceof MultiPoint || geom instanceof Point,
                ) &&
              new Circle({
                radius: 10,
                fill: new Fill({
                  color,
                }),
              }),
          })
        : new Style({
            geometry,
            image: new Circle({
              radius: 10,
              fill: new Fill({
                color,
              }),
            }),
          });
    };

    this.highlightStyle = this.highlightStyle.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  search(value) {
    let params = `line=${encodeURIComponent(value)}`;
    if (lineKilometerRegExp.test(value)) {
      const [, line, , , , km] = value.match(lineKilometerRegExp);
      params = `line=${line}&km=${km}`;
    }
    if (lineMeasuresRegExp.test(value)) {
      const [, line, km, kmEnd] = value.match(lineMeasuresRegExp);
      params = `line=${line}&km=${km}&km_end=${kmEnd}`;
    }
    const baseUrl =
      process.env.REACT_APP_SEARCH_URL || 'https://maps.trafimage.ch';

    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    return fetch(`${baseUrl}/search/lines?${params}`, {
      signal,
    })
      .then((data) => data.json())
      .then((featureCollection) => {
        return featureCollection.features;
      })
      .catch(() => {
        return [];
      });
  }

  render({ properties }) {
    const { t } = this.props;
    return (
      <div>
        {t('Linie')} {properties.linie} ({properties.name})
        {properties.start !== properties.end && (
          <div style={{ color: '#999' }}>
            {t('Kilometer')} {properties.start}
            {properties.end ? `-${properties.end}` : ''}
          </div>
        )}
      </div>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  value({ properties }) {
    return properties.start !== properties.end
      ? `${properties.linie} ${!properties.end ? '+' : ''}${properties.start}${
          properties.end ? `-${properties.end}` : ''
        }`
      : `${properties.linie}`;
  }
}

export default Lines;
