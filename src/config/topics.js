import defaultBaseLayers, {
  swisstopoSwissImage,
  bahnhofplaene,
  passagierfrequenzen,
  netzkarteLayer,
  dataLayer,
  netzkartePointLayer,
  buslines,
  gemeindegrenzen,
  punctuality,
  netzkarteShowcasesNight,
  netzkarteShowcasesLight,
  netzkarteShowcasesNetzkarte,
  parks,
  stuetzpunktbahnhoefe,
  kilometrageLayer,
  constrUnterhalt,
  constrAusbau,
  constructionLayer,
  behigOk,
  behigNotYetOk,
  behigNotOk,
  behigParent,
  grenzen,
  tochtergesellschaftenSBB,
  gewässer,
  uebrigeBahnen,
  netzkarteEisenbahninfrastruktur,
  zweitausbildungAbroad,
  zweitausbildungPois,
  zweitausbildungRoutes,
  zweitausbildungStations,
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
  baseLayerSwitcher: true,
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
  layers: [dataLayer, netzkarteLayer, netzkartePointLayer, bahnhofplaene],
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
    dataLayer,
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
  layers: [
    dataLayer,
    netzkarteLayer,
    behigNotOk,
    behigNotYetOk,
    behigOk,
    behigParent,
  ],
  projection: 'EPSG:3857',
  layerInfoComponent: 'BehigTopicInfo',
  searches: defaultSearches,
};

export const infrastruktur = {
  name: 'ch.sbb.infrastruktur',
  key: 'ch.sbb.infrastruktur',
  maxZoom: 14,
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: [
    netzkarteEisenbahninfrastruktur,
    gewässer,
    grenzen,
    uebrigeBahnen,
    tochtergesellschaftenSBB,
    kilometrageLayer,
  ],
  projection: 'EPSG:3857',
  layerInfoComponent: 'InfrastrukturTopicInfo',
  searches: defaultSearches,
};

export const regionenkarte = {
  name: 'ch.sbb.regionenkarte.public',
  key: 'ch.sbb.regionenkarte.public',
  redirect: true,
  layerInfoComponent: 'RegionenkartePublicTopicInfo',
};

export const regionenkartePrivate = {
  name: 'ch.sbb.regionenkarte.intern',
  key: 'ch.sbb.regionenkarte.intern',
  permission: 'sbb',
  redirect: true,
  layerInfoComponent: 'RegionenkartePrivateTopicInfo',
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
    baseLayerSwitcher: false,
  },
  layers: [
    netzkarteShowcasesNight,
    netzkarteShowcasesLight,
    netzkarteShowcasesNetzkarte,
  ],
  projection: 'EPSG:3857',
  layerInfoComponent: 'ShowcasesTopicInfo',
};

export const intervention = {
  name: 'ch.sbb.intervention',
  key: 'ch.sbb.intervention',
  redirect: true,
  permission: 'sbb',
  layerInfoComponent: 'InterventionTopicInfo',
};

export const dfanachfuehrung = {
  name: 'ch.sbb.dfanachfuehrung',
  key: 'ch.sbb.dfanachfuehrung',
  description: 'ch.sbb.dfanachfuehrung-desc',
  redirect: true,
  permission: 'dfa-nf',
};

export const verbundzonen = {
  name: 'ch.sbb.verbundzonen',
  key: 'ch.sbb.verbundzonen',
  redirect: true,
  permission: 'verbundzonen',
};

export const tina = {
  name: 'ch.sbb.lar',
  key: 'ch.sbb.lar',
  description: 'ch.sbb.lar-desc',
  permission: 'tina',
  redirect: true,
};

export const zweitausbildung = {
  name: 'ch.sbb.zweitausbildung',
  key: 'ch.sbb.zweitausbildung',
  maxZoom: 13,
  hideInLayerTree: true,
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: [
    dataLayer,
    netzkarteLayer,
    zweitausbildungAbroad,
    zweitausbildungPois,
    zweitausbildungRoutes,
    zweitausbildungStations,
  ],
  projection: 'EPSG:3857',
  layerInfoComponent: 'ZweitausbildungTopicInfo',
  searches: defaultSearches,
};

const topics = {
  wkp: [
    netzkarte,
    handicap,
    bauprojekte,
    behig,
    infrastruktur,
    regionenkarte,
    tarifverbundkarte,
    showcases,
    zweitausbildung,
    regionenkartePrivate,
    intervention,
    dfanachfuehrung,
    verbundzonen,
    tina,
  ],
  stelen: [netzkarteStelen],
};

export const getTopicConfig = (apiKey, name) => {
  return topics[name];
};

export default topics;
