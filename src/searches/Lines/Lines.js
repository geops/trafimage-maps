import React from 'react';
import { Style, Circle, Fill, Stroke as OLStroke } from 'ol/style';
import { MultiLineString } from 'ol/geom';
import GeoJSON from 'ol/format/GeoJSON';

import Search from '../Search';
import LayerHelper from '../../layers/layerHelper';

const lineMeasuresRegExp = new RegExp(
  '([0-9]*)\\s*([0-9]+\\.?[0-9]*)\\-([0-9]*\\.?[0-9]*)',
);

const lineKilometerRegExp = new RegExp('^([0-9]+)\\s+([0-9]+\\.?[0-9]+)$');

const color = 'rgba(0,61,155,0.5)';

const lineResolutions = [900, 850, 500, 250, 115, 100, 75, 50, 20, 10, 5];
const lineGeneralisations = {
  900: 5,
  850: 10,
  500: 10,
  250: 30,
  115: 30,
  100: 100,
  75: 100,
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

      return geometry instanceof MultiLineString
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
      const [, line, km] = value.match(lineKilometerRegExp);
      params = `line=${line}&km=${km}`;
    }
    if (lineMeasuresRegExp.test(value)) {
      const [, line, km, kmEnd] = value.match(lineMeasuresRegExp);
      params = `line=${line}&km=${km}&km_end=${kmEnd}`;
    }
    return fetch(`${process.env.REACT_APP_SEARCH_URL}/search/lines?${params}`)
      .then((data) => data.json())
      .then((featureCollection) => featureCollection.features)
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
