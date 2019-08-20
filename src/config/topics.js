import defaultBaseLayers, {
  netzkarteLayer,
  bahnhofplaene,
  netzkartePointLayer,
  tracker,
  parks,
} from './layers';

export const netzkarte = {
  name: 'ÖV Netzkarte Schweiz',
  key: 'ch.sbb.netzkarte',
  layers: [
    ...defaultBaseLayers,
    parks,
    tracker,
    netzkartePointLayer,
    bahnhofplaene,
  ],
  projection: 'EPSG:3857',
};

export const casa = {
  name: 'CASA',
  key: 'ch.sbb.casa',
  layers: [netzkarteLayer],
  projection: 'EPSG:3857',
};

export default [netzkarte, casa];
