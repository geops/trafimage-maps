import defaultBaseLayers, {
  swisstopoSwissImage,
  bahnhofplaene,
  passagierfrequenzen,
  netzkarteLayer,
  sourcesLayer,
  netzkartePointLayer,
  buslines,
  gemeindegrenzen,
  punctuality,
  netzkarteShowcasesNight,
  netzkarteShowcasesLight,
  netzkarteShowcasesNetzkarte,
  parks,
  stuetzpunktbahnhoefe,
  constrUnterhalt,
  constrAusbau,
  constructionLayer,
  behigOk,
  behigNotYetOk,
  behigNotOk,
  behigParent,
} from './layers';
import defaultSearches, {
  handicapStopFinder,
  handicapNoInfoFinder,
} from './searches';

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
  layerInfoComponent: 'NetzkarteTopicInfo',
  searches: defaultSearches,
};

export const handicap = {
  name: 'ch.sbb.handicap',
  key: 'ch.sbb.handicap',
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: [...defaultBaseLayers, stuetzpunktbahnhoefe],
  projection: 'EPSG:3857',
  layerInfoComponent: 'HandicapTopicInfo',
  searches: {
    // prettier-ignore
    'Stützpunktbahnhöfe': handicapStopFinder,
    'Stationen ohne Informationen': handicapNoInfoFinder,
  },
};

export const netzkarteStelen = {
  name: 'ch.sbb.netzkarte',
  key: 'ch.sbb.netzkarte',
  layers: [netzkarteLayer, sourcesLayer, netzkartePointLayer, bahnhofplaene],
  elements: {},
  projection: 'EPSG:3857',
};

export const casa = {
  name: 'CASA',
  key: 'ch.sbb.casa',
  layers: [netzkarteLayer],
  elements: { popup: true },
  projection: 'EPSG:3857',
};

export const bauprojekte = {
  name: 'ch.sbb.construction',
  key: 'ch.sbb.construction',
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: [
    netzkarteLayer,
    swisstopoSwissImage,
    constrUnterhalt,
    constrAusbau,
    constructionLayer,
  ],
  projection: 'EPSG:3857',
  layerInfoComponent: 'ConstructionTopicInfo',
  searches: defaultSearches,
};

export const behig = {
  name: 'ch.sbb.behig',
  key: 'ch.sbb.behig',
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: [netzkarteLayer, behigNotOk, behigNotYetOk, behigOk, behigParent],
  projection: 'EPSG:3857',
  layerInfoComponent: 'BehigTopicInfo',
  searches: defaultSearches,
};

export const infrastruktur = {
  name: 'ch.sbb.infrastruktur',
  key: 'ch.sbb.infrastruktur',
  redirect: true,
  layerInfoComponent: 'InfrastrukturTopicInfo',
};

export const regionenkarte = {
  name: 'ch.sbb.regionenkarte.public',
  key: 'ch.sbb.regionenkarte.public',
  redirect: true,
  layerInfoComponent: 'RegionenkartePublicTopicInfo',
};

export const tarifverbundkarte = {
  name: 'ch.sbb.tarifverbundkarte.public',
  key: 'ch.sbb.tarifverbundkarte.public',
  redirect: true,
  layerInfoComponent: 'TarifverbundkarteTopicInfo',
};

export const showcases = {
  name: 'ch.sbb.showcases',
  key: 'ch.sbb.showcases',
  elements: {
    ...defaultElements,
    baseLayerToggler: false,
  },
  layers: [
    netzkarteShowcasesNight,
    netzkarteShowcasesLight,
    netzkarteShowcasesNetzkarte,
  ],
  projection: 'EPSG:3857',
  layerInfoComponent: 'ShowcasesTopicInfo',
};

export const infofpw = {
  name: 'ch.sbb.infofpw',
  key: 'ch.sbb.infofpw',
  permission: 'sbb',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.infofpw',
};

export const intervention = {
  name: 'ch.sbb.intervention',
  key: 'ch.sbb.intervention',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.intervention',
  permission: 'sbb',
};

export const dfanachfuehrung = {
  name: 'ch.sbb.dfanachfuehrung',
  key: 'ch.sbb.dfanachfuehrung',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.dfanachfuehrung',
  permission: 'dfa-nf',
};

export const mobz = {
  name: 'ch.sbb.mobz',
  key: 'ch.sbb.mobz',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.mobz',
  permission: 'mobz',
};

export const mobzWhatIf = {
  name: 'ch.sbb.mobz_what_if',
  key: 'ch.sbb.mobz_what_if',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.mobz_what_if',
  permission: 'mobz_what_if',
};

export const verbundzonen = {
  name: 'ch.sbb.verbundzonen',
  key: 'ch.sbb.verbundzonen',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.verbundzonen',
  permission: 'verbundzonen',
};

export const tina = {
  name: 'ch.sbb.lar',
  key: 'ch.sbb.lar',
  permission: 'tina',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.tina',
};

const topics = {
  wkp: [
    netzkarte,
    handicap,
    bauprojekte,
    behig,
    infrastruktur,
    tarifverbundkarte,
    showcases,
    regionenkarte,
    infofpw,
    intervention,
    dfanachfuehrung,
    mobz,
    mobzWhatIf,
    verbundzonen,
    tina,
  ],
  stelen: [netzkarteStelen],
};

export const getTopicConfig = (apiKey, name) => {
  punctuality.getChildren().forEach(layer => {
    // eslint-disable-next-line no-param-reassign
    layer.apiKey = apiKey;
  });
  return topics[name];
};

export default topics;
