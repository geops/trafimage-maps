import React from 'react';
import { Style, Stroke as OLStroke } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';

import Search from '../Search';
import layerHelper from '../../layers/layerHelper';

const lineMeasuresRegExp = new RegExp(
  '([0-9]*)\\s*([0-9]+\\.?[0-9]*)\\-([0-9]*\\.?[0-9]*)',
);

class Lines extends Search {
  constructor() {
    super();
    this.dataProjection = 'EPSG:21781';

    this.highlightStyle = (f, r) => {
      const gen = layerHelper.getGeneralization(r);
      const format = new GeoJSON();
      const geometry =
        format.readGeometry(f.get('geoms')[gen], {
          dataProjection: this.dataProjection,
          featureProjection: 'EPSG:3857',
        }) || f.getGeometry();

      return new Style({
        geometry,
        stroke: new OLStroke({
          color: 'rgba(0,61,155,0.5)',
          width: 10,
        }),
      });
    };
  }

  // eslint-disable-next-line class-methods-use-this
  search(value) {
    let params = `line=${value}`;
    if (lineMeasuresRegExp.test(value)) {
      const [, line, km, kmEnd] = value.match(lineMeasuresRegExp);
      params = `line=${line}&km=${km}&km_end=${kmEnd}`;
    }
    return fetch(`https://maps.trafimage.ch/search/lines?${params}`)
      .then(data => data.json())
      .then(featureCollection => featureCollection.features);
  }

  render({ properties }) {
    return (
      <div>
        Linie {properties.linie} ({properties.name})
        {properties.start !== properties.end && (
          <div style={{ color: '#999' }}>
            Kilometer {properties.start}-{properties.end}
          </div>
        )}
      </div>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  value({ properties }) {
    return properties.start !== properties.end
      ? `${properties.linie} ${properties.start}-${properties.end}`
      : `${properties.linie}`;
  }
}

export default Lines;
