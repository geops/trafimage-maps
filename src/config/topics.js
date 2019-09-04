import defaultBaseLayers, {
  bahnhofplaene,
  passagierfrequenzen,
  netzkarteLayer,
  netzkartePointLayer,
  buslines,
  gemeindegrenzen,
  punctuality,
  parks,
} from './layers';

export const netzkarte = {
  name: 'ch.sbb.netzkarte',
  key: 'ch.sbb.netzkarte',
  layers: [
    ...defaultBaseLayers,
    gemeindegrenzen,
    parks,
    punctuality,
    buslines,
    netzkartePointLayer,
    passagierfrequenzen,
    bahnhofplaene,
  ],
  projection: 'EPSG:3857',
};

export const netzkarteStelen = {
  name: 'ch.sbb.netzkarte',
  key: 'ch.sbb.netzkarte',
  layers: [netzkarteLayer],
  projection: 'EPSG:3857',
};

export const casa = {
  name: 'CASA',
  key: 'ch.sbb.casa',
  layers: [netzkarteLayer],
  projection: 'EPSG:3857',
};

export const bauprojekte = {
  name: 'ch.sbb.construction',
  key: 'ch.sbb.construction',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.construction',
};

export const behig = {
  name: 'ch.sbb.behig',
  key: 'ch.sbb.behig',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.infrastruktur',
};

export const infrastruktur = {
  name: 'ch.sbb.infrastruktur',
  key: 'ch.sbb.infrastruktur',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.infrastruktur',
};

export const regionenkarte = {
  name: 'ch.sbb.regionenkarte.public',
  key: 'ch.sbb.regionenkarte.public',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.regionenkarte.public',
};

export const tarifverbundkarte = {
  name: 'ch.sbb.tarifverbundkarte.public',
  key: 'ch.sbb.tarifverbundkarte.public',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.tarifverbundkarte.public',
};

export default [
  netzkarte,
  bauprojekte,
  behig,
  infrastruktur,
  regionenkarte,
  tarifverbundkarte,
];
