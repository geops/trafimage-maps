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
  mobzHauptzentrumsHubs,
  mobzUmsteigebahnhof,
  mobzAgglomerationsHubs,
  mobzStadtbahnhof,
  mobzZentrumHubs,
  mobzRegionalHubs,
  mobzParent,
  mobzWhatIfParent,
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

export const mobz = {
  name: 'ch.sbb.mobz',
  key: 'ch.sbb.mobz',
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: [
    netzkarteLayer,
    mobzRegionalHubs,
    mobzZentrumHubs,
    mobzStadtbahnhof,
    mobzAgglomerationsHubs,
    mobzUmsteigebahnhof,
    mobzHauptzentrumsHubs,
    mobzParent,
  ],
  projection: 'EPSG:3857',
  layerInfoComponent: 'MobzTopicInfo',
  searches: defaultSearches,
};

export const mobzWhatIf = {
  name: 'ch.sbb.mobz_what_if',
  key: 'ch.sbb.mobz_what_if',
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: [
    netzkarteLayer,
    mobzRegionalHubs,
    mobzZentrumHubs,
    mobzStadtbahnhof,
    mobzAgglomerationsHubs,
    mobzUmsteigebahnhof,
    mobzHauptzentrumsHubs,
    mobzWhatIfParent,
  ],
  projection: 'EPSG:3857',
  layerInfoComponent: 'MobzTopicInfo',
  searches: defaultSearches,
};

export const infrastruktur = {
  name: 'ch.sbb.infrastruktur',
  key: 'ch.sbb.infrastruktur',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.infrastruktur',
  layerInfoComponent: 'InfrastrukturTopicInfo',
};

export const regionenkarte = {
  name: 'ch.sbb.regionenkarte.public',
  key: 'ch.sbb.regionenkarte.public',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.regionenkarte.public',
  layerInfoComponent: 'RegionenkartePublicTopicInfo',
};

export const tarifverbundkarte = {
  name: 'ch.sbb.tarifverbundkarte.public',
  key: 'ch.sbb.tarifverbundkarte.public',
  linkUrl: 'https://maps.trafimage.ch/#/ch.sbb.tarifverbundkarte.public',
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

const topics = {
  wkp: [
    netzkarte,
    handicap,
    bauprojekte,
    behig,
    mobz,
    mobzWhatIf,
    infrastruktur,
    regionenkarte,
    tarifverbundkarte,
    showcases,
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
