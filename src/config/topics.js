import defaultBaseLayers, {
  bahnhofplaene,
  passagierfrequenzen,
  netzkarteLayer,
  netzkartePointLayer,
  buslines,
  gemeindegrenzen,
  punctuality,
  netzkarteShowcases,
  parks,
  stuetzpunktbahnhoefe,
} from './layers';
import defaultSearches, { handicapStopFinder } from './searches';

const defaultElements = {
  header: true,
  footer: true,
  menu: true,
  permalink: true,
  mapControls: true,
  baseLayerToggler: true,
  popup: false,
  search: true,
};

export const netzkarte = {
  name: 'ch.sbb.netzkarte',
  key: 'ch.sbb.netzkarte',
  elements: {
    ...defaultElements,
    popup: true,
    shareMenu: true,
    trackerMenu: true,
  },
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
  description: 'ch.sbb.netzkarte-desc',
  searches: defaultSearches,
};

export const handicap = {
  name: 'ch.sbb.handicap',
  key: 'ch.sbb.handicap',
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: [...defaultBaseLayers, stuetzpunktbahnhoefe],
  projection: 'EPSG:3857',
  description: 'ch.sbb.handicap-desc',
  searches: { Stationen: handicapStopFinder },
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
  description: 'ch.sbb.construction-desc',
};

export const behig = {
  name: 'ch.sbb.behig',
  key: 'ch.sbb.behig',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.infrastruktur',
  description: 'ch.sbb.behig-desc',
  legendUrl: '/img/topics/behig/behig_legend_{language}.jpg',
};

export const infrastruktur = {
  name: 'ch.sbb.infrastruktur',
  key: 'ch.sbb.infrastruktur',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.infrastruktur',
  description: 'ch.sbb.infrastruktur-desc',
};

export const regionenkarte = {
  name: 'ch.sbb.regionenkarte.public',
  key: 'ch.sbb.regionenkarte.public',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.regionenkarte.public',
  description: 'ch.sbb.regionenkarte.public-desc',
};

export const tarifverbundkarte = {
  name: 'ch.sbb.tarifverbundkarte.public',
  key: 'ch.sbb.tarifverbundkarte.public',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.tarifverbundkarte.public',
  description: 'ch.sbb.tarifverbundkarte.public-desc',
  legendUrl: '/img/topics/tarifverbundkarte/tarifverbundkarte_legend.png',
};

export const showcases = {
  name: 'ch.sbb.showcases',
  key: 'ch.sbb.showcases',
  elements: {
    ...defaultElements,
    baseLayerToggler: false,
  },
  layers: [netzkarteShowcases],
  projection: 'EPSG:3857',
  description: 'ch.sbb.showcases-desc',
};

export default [
  netzkarte,
  handicap,
  bauprojekte,
  behig,
  infrastruktur,
  regionenkarte,
  tarifverbundkarte,
  showcases,
];
