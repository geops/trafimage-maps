import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import { kilometrageLayer } from '../ch.sbb.infrastruktur';

export const netzkarteIsb = new TrafimageMapboxLayer({
  name: 'ch.sbb.isb',
  isBaseLayer: true,
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1,
  style: 'netzkarte_eisenbahninfrastruktur_v3_ch.sbb.infrastrukturbetreiber',
});

// Order is important for the legend
// WARNING: use UPPER CASE for the key
const shortToLongNameOther = {
  AB: 'Appenzeller Bahnen',
  asm: 'Aare Seeland mobil AG',
  AVA: 'Aargau Verkehr AG',
  DB: 'Deutsche Bahn AG',
  ÖBB: 'Österreichische Bundesbahnen',
  RB: 'Rigi Bahnen',
  RBS: 'Regionalverkehr Bern-Solothurn AG',
  RhB: 'Rhätische Bahn AG',
  SEHR: 'Stein am Rhein-Etzwilen-Hemishofen-Ramsen-Bahn',
  SZU: 'Sihltal Zürich Uetliberg Bahn SZU AG',
  TL: 'Transports publics de la région lausannoise',
  VVT: 'Vapeur Val-de-Travers',
  zb: 'Zentralbahn AG',
};

export const isbOther = new MapboxStyleLayer({
  name: 'ch.sbb.isb.other',
  mapboxLayer: netzkarteIsb,
  styleLayersFilter: ({ metadata }) =>
    metadata &&
    metadata['isb.filter'] &&
    /^(other|other_flag)$/.test(metadata['isb.filter']),
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata &&
    metadata['isb.filter'] &&
    /^other$/.test(metadata['isb.filter']),
  properties: {
    hasInfos: true,
    useOverlay: true,
    popupComponent: 'IsbPopup',
    layerInfoComponent: 'IsbOtherLayerInfo',
    shortToLongName: shortToLongNameOther,
    defaultColor: 'rgba(153, 71, 241, 1)', // Must be the same as in the style.
  },
});

// Order is important for the legend
// WARNING: use UPPER CASE for the key
const shortToLongNameTVS = {
  'SBB CFF FFS': 'SBB Infrastruktur',
  BLS: 'BLS Netz AG',
  SOB: 'SOB AG Infrastruktur',
  CJ: 'Compagnie des chemins de fer du Jura SA',
  ETB: 'Emmentalbahn GmbH',
  HBS: 'Hafenbahn Schweiz AG',
  OeBB: 'Oensingen-Balsthal-Bahn',
  ST: 'Sursee-Triengen-Bahn',
  STB: 'Sensetalbahn AG',
  SZU: 'Sihltal Zürich Uetliberg Bahn SZU AG',
  TMR: 'Transports de Martigny et Régions SA',
  TPF: 'Transports publics fribourgeois SA',
  TRAVYS: 'Travys',
  TRN: 'Transports Publics Neuchâtelois',
};

export const isbTVS = new MapboxStyleLayer({
  name: 'ch.sbb.isb.tvs',
  mapboxLayer: netzkarteIsb,
  styleLayersFilter: ({ metadata }) =>
    metadata &&
    metadata['isb.filter'] &&
    /^(tvs|tvs_flag)$/.test(metadata['isb.filter']),
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata['isb.filter'] && /^tvs$/.test(metadata['isb.filter']),
  properties: {
    hasInfos: true,
    useOverlay: true,
    popupComponent: 'IsbPopup',
    layerInfoComponent: 'IsbTVSLayerInfo',
    shortToLongName: shortToLongNameTVS,
    defaultColor: 'rgba(0,91,169 , 1)', // Must be the same as in the style.
    colors: {
      'SBB CFF FFS': 'rgba(209, 1, 7, 1)',
      BLS: 'rgba(53,164,48, 1)',
      SOB: 'rgba(195, 156, 54, 1)',
    },
  },
});

export default [kilometrageLayer, netzkarteIsb, isbOther, isbTVS];