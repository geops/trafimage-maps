import defaultBaseLayers, {
  netzkarteLayer,
  bahnhofplaene,
  netzkartePointLayer,
  buslines,
  gemeindegrenzen,
  punctuality,
  tracker,
  parks,
} from './layers';

export const netzkarte = {
  name: 'ÖV Netzkarte Schweiz',
  key: 'ch.sbb.netzkarte',
  layers: [
    ...defaultBaseLayers,
    gemeindegrenzen,
    parks,
    tracker,
    punctuality,
    buslines,
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
