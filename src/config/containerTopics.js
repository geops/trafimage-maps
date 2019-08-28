import { netzkarteLayer } from './layers';

export const netzkarte = {
  name: 'ÖV Netzkarte Schweiz',
  key: 'ch.sbb.netzkarte',
  layers: [netzkarteLayer],
  projection: 'EPSG:3857',
};

export default [netzkarte];
