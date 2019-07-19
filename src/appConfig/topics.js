import defaultBaseLayers, { netzkarte, osm } from './layers';

export default [
  {
    name: 'ÖV Netzkarte Schweiz',
    key: 'ch.sbb.netzkarte',
    layers: defaultBaseLayers,
    projection: 'EPSG:3857',
  },
  {
    name: 'CASA',
    key: 'ch.sbb.casa',
    layers: [netzkarte, osm],
    projection: 'EPSG:3857',
  },
];
