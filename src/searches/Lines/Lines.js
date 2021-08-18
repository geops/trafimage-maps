import React from 'react';
import { Style, Circle, Fill, Stroke as OLStroke } from 'ol/style';
import { MultiLineString, GeometryCollection } from 'ol/geom';
import GeoJSON from 'ol/format/GeoJSON';

import Search from '../Search';
import LayerHelper from '../../layers/layerHelper';

const lineMeasuresRegExp = new RegExp(
  '([0-9]*)\\s*([0-9]+\\.?[0-9]*)\\-([0-9]*\\.?[0-9]*)',
);

const lineKilometerRegExp = new RegExp(
  '^([0-9]+)(\\s)(\\+)?(\\s+)?([0-9]+(\\.[0-9]+)?)$',
);

const color = 'rgba(0,61,155,0.5)';

const lineResolutions = [900, 612, 611, 306, 305, 79, 78, 50];
const lineGeneralisations = {
  900: 5,
  612: 5,
  611: 10, // zoom 8
  306: 10,
  305: 30, // zoom 9
  79: 30,
  78: 100, // zoom 11
  50: 100,
};

class Lines extends Search {
  constructor() {
    super();
    this.dataProjection = 'EPSG:21781';

    this.highlightStyle = (f, r) => {
      const gen = LayerHelper.getGeneralization(
        r,
        lineResolutions,
        lineGeneralisations,
      );
      const format = new GeoJSON();
      const geometry =
        format.readGeometry(f.get('geoms')[gen], {
          dataProjection: this.dataProjection,
          featureProjection: 'EPSG:3857',
        }) || f.getGeometry();

      return geometry instanceof MultiLineString ||
        geometry instanceof GeometryCollection
        ? new Style({
            geometry,
            stroke: new OLStroke({
              color,
              width: 10,
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
    return fetch(`${baseUrl}/search/lines?${params}`)
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
      ? `${properties.linie} ${properties.start}${
          properties.end ? `-${properties.end}` : ''
        }`
      : `${properties.linie}`;
  }
}

export default Lines;
