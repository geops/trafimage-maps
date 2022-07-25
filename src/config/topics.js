import './proj4';
import { getCenter } from 'ol/extent';
import tarifverbundkarteLegend from '../img/tarifverbund_legend.svg';
import netzkarteLayers, {
  dataLayer,
  netzkarteLayer,
  stationsLayer,
  bahnhofplaene,
} from './ch.sbb.netzkarte';
import constructionLayers from './ch.sbb.construction';
import handicapLayers from './ch.sbb.handicap';
import casaLayers from './ch.sbb.casa';
import infrastrukturLayers, {
  netzkarteEisenbahninfrastruktur,
  betriebsRegionenVisible,
} from './ch.sbb.infrastruktur';
import energieLayers from './ch.sbb.energie';
import tarifverbundkarteLayers from './ch.sbb.tarifverbundkarte.public';
import regionenkarteLayers from './ch.sbb.regionenkarte.public';
import netzentwicklungLayers from './ch.sbb.netzentwicklung';
import beleuchtungLayers from './ch.sbb.beleuchtungsstaerken';
import isbLayers from './ch.sbb.isb';
import sandboxLayers from './ch.sbb.netzkarte.sandbox';
import zweitausbildungLayers from './ch.sbb.zweitausbildung';
import defaultSearches, { handicapStopFinder } from './searches';

// For backward compatibility
export {
  casaDataLayerWithoutLabels,
  casaNetzkarteLayerWithLabels,
  casaNetzkarteLayerWithoutLabels,
} from './ch.sbb.casa';

const defaultElements = {
  header: true,
  footer: true,
  menu: true,
  permalink: true,
  mapControls: true,
  baseLayerSwitcher: true,
  popup: false,
  search: true,
  drawMenu: true,
  overlay: true,
};

export const netzkarte = {
  name: 'ch.sbb.netzkarte.topic',
  key: 'ch.sbb.netzkarte',
  elements: {
    ...defaultElements,
    popup: true,
    shareMenu: true,
    trackerMenu: true,
  },
  layers: netzkarteLayers,
  projection: 'EPSG:3857',
  layerInfoComponent: 'NetzkarteTopicInfo',
  searches: defaultSearches,
};

export const handicap = {
  name: 'ch.sbb.handicap',
  key: 'ch.sbb.handicap',
  elements: {
    ...defaultElements,
    shareMenu: true,
    popup: true,
  },
  layers: handicapLayers,
  projection: 'EPSG:3857',
  layerInfoComponent: 'HandicapTopicInfo',
  searches: {
    Stationen: handicapStopFinder,
  },
};

export const netzkarteStelen = {
  name: 'ch.sbb.netzkarte.topic',
  key: 'ch.sbb.netzkarte',
  layers: [dataLayer, netzkarteLayer, stationsLayer, bahnhofplaene],
  elements: {},
  projection: 'EPSG:3857',
};

export const casa = {
  name: 'CASA',
  key: 'ch.sbb.casa',
  layers: casaLayers,
  projection: 'EPSG:3857',
  popupConfig: {
    getPopupCoordinates: (feature, map) => {
      const mapCenter = getCenter(map.getView().calculateExtent());
      return feature.getGeometry().getClosestPoint(mapCenter);
    },
  },
  elements: {
    menu: true,
    popup: true,
    permalink: false,
    baseLayerSwitcher: true,
  },
};

export const bauprojekte = {
  name: 'ch.sbb.construction',
  key: 'ch.sbb.construction',
  elements: {
    ...defaultElements,
    shareMenu: true,
    popup: true,
    filter: true,
    filters: true,
  },
  layers: constructionLayers,
  projection: 'EPSG:3857',
  layerInfoComponent: 'ConstructionTopicInfo',
  searches: defaultSearches,
};

export const infrastruktur = {
  name: 'ch.sbb.infrastruktur',
  key: 'ch.sbb.infrastruktur',
  maxZoom: 14,
  elements: {
    ...defaultElements,
    shareMenu: true,
    popup: true,
  },
  layers: infrastrukturLayers,
  projection: 'EPSG:3857',
  layerInfoComponent: 'InfrastrukturTopicInfo',
  searches: defaultSearches,
};

export const betriebsregionen = {
  name: 'ch.sbb.infrastruktur',
  key: 'ch.sbb.infrastruktur',
  elements: {
    ...defaultElements,
    header: false,
    search: false,
    drawMenu: false,
    popup: true,
  },
  layers: [netzkarteEisenbahninfrastruktur, betriebsRegionenVisible],
  projection: 'EPSG:3857',
};

export const regionenkartePublic = {
  name: 'ch.sbb.regionenkarte.public',
  key: 'ch.sbb.regionenkarte.public',
  maxZoom: 13,
  elements: {
    ...defaultElements,
    popup: true,
    overlay: true,
  },
  layers: regionenkarteLayers,
  layerInfoComponent: 'RegionenkartePublicTopicInfo',
  searches: defaultSearches,
};

export const tarifverbundkarte = {
  name: 'ch.sbb.tarifverbundkarte.public',
  key: 'ch.sbb.tarifverbundkarte.public',
  layerInfoComponent: 'TarifverbundkarteTopicInfo',
  layers: tarifverbundkarteLayers,
  maxZoom: 12,
  exportConfig: {
    publisher: 'tobias.hauser@sbb.ch',
    publishedAt: '12/2021',
    dateDe: '12.12.2021',
    dateFr: '12.12.2021',
    year: '2021',
    overlayImageUrl: tarifverbundkarteLegend,
  },
  elements: {
    ...defaultElements,
    popup: true,
    shareMenu: { collapsedOnLoad: true },
    trackerMenu: true,
    exportMenu: true,
    drawMenu: { collapsedOnLoad: true },
  },
  searches: defaultSearches,
};

export const zweitausbildung = {
  name: 'ch.sbb.zweitausbildung',
  key: 'ch.sbb.zweitausbildung',
  maxZoom: 13,
  hideInLayerTree: true,
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: zweitausbildungLayers,
  projection: 'EPSG:3857',
  layerInfoComponent: 'ZweitausbildungTopicInfo',
  searches: defaultSearches,
};

export const netzentwicklung = {
  name: 'ch.sbb.netzentwicklung',
  key: 'ch.sbb.netzentwicklung',
  maxZoom: 13,
  elements: { ...defaultElements, shareMenu: true, popup: true, overlay: true },
  layers: netzentwicklungLayers,
  projection: 'EPSG:3857',
  layerInfoComponent: 'NetzentwicklungTopicInfo',
  searches: defaultSearches,
};

export const beleuchtungsstaerken = {
  name: 'ch.sbb.beleuchtungsstaerken',
  key: 'ch.sbb.beleuchtungsstaerken',
  maxZoom: 13,
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: beleuchtungLayers,
  projection: 'EPSG:3857',
  layerInfoComponent: 'BeleuchtungTopicInfo',
  searches: defaultSearches,
};

export const energiePublic = {
  name: 'ch.sbb.energie',
  key: 'ch.sbb.energie',
  maxZoom: 14,
  elements: { ...defaultElements, shareMenu: true, popup: true, overlay: true },
  layers: energieLayers,
  projection: 'EPSG:3857',
  layerInfoComponent: 'EnergiePublicTopicInfo',
  searches: defaultSearches,
};

export const isb = {
  name: 'ch.sbb.isb',
  key: 'ch.sbb.isb',
  maxZoom: 14,
  elements: {
    ...defaultElements,
    shareMenu: true,
    popup: true,
  },
  layers: isbLayers,
  projection: 'EPSG:3857',
  layerInfoComponent: 'IsbTopicInfo',
  searches: defaultSearches,
};

const sandbox = {
  name: 'ch.sbb.netzkarte.sandbox',
  key: 'ch.sbb.netzkarte.sandbox',
  layers: sandboxLayers,
  projection: 'EPSG:3857',
  elements: {
    ...defaultElements,
  },
  layerInfoComponent: 'SandboxTopicInfo',
  searches: defaultSearches,
};

const topics = {
  wkp: [
    netzkarte,
    zweitausbildung,
    bauprojekte,
    handicap,
    tarifverbundkarte,
    infrastruktur,
    isb,
    regionenkartePublic,
    netzentwicklung,
    beleuchtungsstaerken,
    energiePublic,
    sandbox,
  ],
  stelen: [netzkarteStelen],
  betriebsregionen: [betriebsregionen],
};

export const getTopicConfig = (name) => {
  return topics[name];
};

export default topics;
