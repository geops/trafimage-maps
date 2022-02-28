import { getCenter } from 'ol/extent';
import TrafimageMapboxLayer from '../layers/TrafimageMapboxLayer';
import StationsLayer from '../layers/StationsLayer';
import tarifverbundkarteLegend from '../img/tarifverbund_legend.svg';
import defaultBaseLayers, {
  swisstopoSwissImage,
  bahnhofplaene,
  passagierfrequenzen,
  netzkarteLayer,
  dataLayer,
  netzkartePointLayer,
  platformsLayer,
  buslines,
  gemeindegrenzen,
  punctuality,
  netzkarteShowcasesNight,
  netzkarteShowcasesLight,
  netzkarteShowcasesNetzkarte,
  handicapDataLayer,
  stuetzpunktBahnhoefe,
  barrierfreierBahnhoefe,
  nichtBarrierfreierBahnhoefe,
  kilometrageLayer,
  constrUnterhalt,
  constrAusbau,
  constrClusters,
  constructionDataLayer,
  grenzen,
  tochtergesellschaftenSBB,
  gewässer,
  uebrigeBahnen,
  betriebsRegionen,
  betriebsRegionenVisible,
  netzkarteEisenbahninfrastruktur,
  zweitausbildungAbroad,
  zweitausbildungPois,
  zweitausbildungRoutes,
  zweitausbildungStations,
  zweitausbildungStationsDataLayer,
  zweitausbildungPoisDataLayer,
  tarifverbundkarteDataLayer,
  tarifverbundkarteLayer,
  anlagenverantwortliche,
  regionenkartePublicSegment,
  regionenkarteOverlayGroup,
  netzentwicklungDataLayer,
  netzentwicklungStrategischLayer,
  netzentwicklungProgrammManagerLayer,
  netzentwicklungSkPlanerLayer,
  beleuchtungDataLayer,
  beleuchtungstaerken1Layer,
  beleuchtungstaerken2aLayer,
  beleuchtungstaerken2bLayer,
  beleuchtungstaerken3Layer,
  beleuchtungstaerken4Layer,
  beleuchtungstaerkenSchutzgebieteLayer,
  beleuchtungstaerkenBundesInventareLayer,
  direktverbindungenLayer,
  energieUnterwerkeLayer,
  energieProduktionsanlagenLayer,
  energieLeitungenLayer,
  geschosseLayer,
  energieDataLayer,
} from './layers';
import defaultSearches, { handicapStopFinder } from './searches';

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
  layers: [
    ...defaultBaseLayers,
    punctuality,
    netzkartePointLayer,
    platformsLayer,
    passagierfrequenzen,
    gemeindegrenzen,
    buslines,
    bahnhofplaene,
    direktverbindungenLayer,
  ],
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
  layers: [
    ...defaultBaseLayers,
    handicapDataLayer,
    bahnhofplaene,
    nichtBarrierfreierBahnhoefe,
    barrierfreierBahnhoefe,
    stuetzpunktBahnhoefe,
  ],
  projection: 'EPSG:3857',
  layerInfoComponent: 'HandicapTopicInfo',
  searches: {
    Stationen: handicapStopFinder,
  },
};

export const netzkarteStelen = {
  name: 'ch.sbb.netzkarte.topic',
  key: 'ch.sbb.netzkarte',
  layers: [dataLayer, netzkarteLayer, netzkartePointLayer, bahnhofplaene],
  elements: {},
  projection: 'EPSG:3857',
};

export const casaDataLayerWithoutLabels = dataLayer.clone({
  filters: [
    {
      field: 'type',
      value: /symbol|circle/,
      include: false,
    },
  ],
});

export const casaNetzkarteLayerWithoutLabels = netzkarteLayer.clone({
  mapboxLayer: casaDataLayerWithoutLabels,
});

const casaSwisstopoSwissImage = swisstopoSwissImage.clone({
  mapboxLayer: casaDataLayerWithoutLabels,
});

export const casaNetzkarteLayerWithLabels = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.labels',
  visible: true,
  style: 'base_bright_v2',
  filters: [
    {
      field: 'type',
      value: /symbol|circle/i,
      include: true,
    },
  ],
  zIndex: 2,
  properties: {
    hideInLegend: true,
  },
});

// Add stations (blue style on hover) to labelsDataLayer.
const casaNetzkarteStationsLayer = new StationsLayer({
  name: 'ch.sbb.netzkarte.stationen.casa',
  mapboxLayer: casaNetzkarteLayerWithLabels,
});

export const casa = {
  name: 'CASA',
  key: 'ch.sbb.casa',
  layers: [
    casaDataLayerWithoutLabels,
    casaNetzkarteLayerWithoutLabels,
    casaSwisstopoSwissImage,
    casaNetzkarteLayerWithLabels,
    casaNetzkarteStationsLayer,
  ],
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
  layers: [
    dataLayer,
    netzkarteLayer,
    swisstopoSwissImage,
    constructionDataLayer,
    constrUnterhalt,
    constrAusbau,
    constrClusters,
  ],
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
  layers: [
    netzkarteEisenbahninfrastruktur,
    uebrigeBahnen,
    tochtergesellschaftenSBB,
    grenzen,
    gewässer,
    betriebsRegionen,
    kilometrageLayer,
  ],
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
  layers: [
    anlagenverantwortliche,
    regionenkarteOverlayGroup,
    regionenkartePublicSegment,
    kilometrageLayer,
  ],
  layerInfoComponent: 'RegionenkartePublicTopicInfo',
  searches: defaultSearches,
};

export const tarifverbundkarte = {
  name: 'ch.sbb.tarifverbundkarte.public',
  key: 'ch.sbb.tarifverbundkarte.public',
  layerInfoComponent: 'TarifverbundkarteTopicInfo',
  layers: [tarifverbundkarteDataLayer, tarifverbundkarteLayer],
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

export const zweitausbildung = {
  name: 'ch.sbb.zweitausbildung',
  key: 'ch.sbb.zweitausbildung',
  maxZoom: 13,
  hideInLayerTree: true,
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: [
    dataLayer,
    zweitausbildungStationsDataLayer,
    zweitausbildungPoisDataLayer,
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

export const netzentwicklung = {
  name: 'ch.sbb.netzentwicklung',
  key: 'ch.sbb.netzentwicklung',
  maxZoom: 13,
  elements: { ...defaultElements, shareMenu: true, popup: true, overlay: true },
  layers: [
    kilometrageLayer,
    netzentwicklungDataLayer,
    netzentwicklungStrategischLayer,
    netzentwicklungProgrammManagerLayer,
    netzentwicklungSkPlanerLayer,
  ],
  projection: 'EPSG:3857',
  layerInfoComponent: 'NetzentwicklungTopicInfo',
  searches: defaultSearches,
};

export const beleuchtungsstaerken = {
  name: 'ch.sbb.beleuchtungsstaerken',
  key: 'ch.sbb.beleuchtungsstaerken',
  maxZoom: 13,
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: [
    beleuchtungDataLayer,
    beleuchtungstaerkenBundesInventareLayer,
    beleuchtungstaerkenSchutzgebieteLayer,
    beleuchtungstaerken4Layer,
    beleuchtungstaerken3Layer,
    beleuchtungstaerken2bLayer,
    beleuchtungstaerken2aLayer,
    beleuchtungstaerken1Layer,
  ],
  projection: 'EPSG:3857',
  layerInfoComponent: 'BeleuchtungTopicInfo',
  searches: defaultSearches,
};

export const energie = {
  name: 'ch.sbb.energie',
  key: 'ch.sbb.energie',
  maxZoom: 14,
  elements: { ...defaultElements, shareMenu: true, popup: true, overlay: true },
  layers: [
    energieDataLayer,
    energieLeitungenLayer,
    energieUnterwerkeLayer,
    energieProduktionsanlagenLayer,
  ],
  projection: 'EPSG:3857',
  layerInfoComponent: 'EnergieTopicInfo',
  searches: defaultSearches,
};

const sandbox = {
  name: 'ch.sbb.netzkarte.sandbox',
  key: 'ch.sbb.netzkarte.sandbox',
  layers: [dataLayer, netzkarteLayer, geschosseLayer],
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
    regionenkartePublic,
    netzentwicklung,
    beleuchtungsstaerken,
    energie,
    showcases,
    sandbox,
  ],
  stelen: [netzkarteStelen],
  betriebsregionen: [betriebsregionen],
};

export const getTopicConfig = (name) => {
  return topics[name];
};

export default topics;
