import BeleuchtungsLayer from '../../layers/BeleuchtungsLayer';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import MapsGeoAdminLayer from '../../layers/MapsGeoAdminLayer';

export const beleuchtungDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.beleuchtungsstaerken.data',
  visible: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'netzkarte_eisenbahninfrastruktur_v3_ch.sbb.beleuchtung',
  properties: {
    hideInLegend: true,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
});

export const beleuchtungstaerken1Layer = new BeleuchtungsLayer({
  name: 'ch.sbb.beleuchtungsstaerken1',
  mapboxLayer: beleuchtungDataLayer,
  styleLayersFilter: ({ metadata }) => metadata && metadata.rte_klasse === '1',
  properties: {
    hasInfos: true,
    useOverlay: true,
    popupComponent: 'BeleuchtungsPopup',
    layerInfoComponent: 'BeleuchtungLayerInfo',
    isQueryable: true,
  },
});

export const beleuchtungstaerken2aLayer = new BeleuchtungsLayer({
  name: 'ch.sbb.beleuchtungsstaerken2a',
  mapboxLayer: beleuchtungDataLayer,
  styleLayersFilter: ({ metadata }) => metadata && metadata.rte_klasse === '2a',
  properties: {
    hasInfos: true,
    useOverlay: true,
    popupComponent: 'BeleuchtungsPopup',
    layerInfoComponent: 'BeleuchtungLayerInfo',
    isQueryable: true,
  },
});

export const beleuchtungstaerken2bLayer = new BeleuchtungsLayer({
  name: 'ch.sbb.beleuchtungsstaerken2b',
  mapboxLayer: beleuchtungDataLayer,
  styleLayersFilter: ({ metadata }) => metadata && metadata.rte_klasse === '2b',
  properties: {
    hasInfos: true,
    useOverlay: true,
    popupComponent: 'BeleuchtungsPopup',
    layerInfoComponent: 'BeleuchtungLayerInfo',
    isQueryable: true,
  },
});

export const beleuchtungstaerken3Layer = new BeleuchtungsLayer({
  name: 'ch.sbb.beleuchtungsstaerken3',
  mapboxLayer: beleuchtungDataLayer,
  styleLayersFilter: ({ metadata }) => metadata && metadata.rte_klasse === '3',
  properties: {
    hasInfos: true,
    useOverlay: true,
    popupComponent: 'BeleuchtungsPopup',
    layerInfoComponent: 'BeleuchtungLayerInfo',
    isQueryable: true,
  },
});

export const beleuchtungstaerken4Layer = new BeleuchtungsLayer({
  name: 'ch.sbb.beleuchtungsstaerken4',
  mapboxLayer: beleuchtungDataLayer,
  styleLayersFilter: ({ metadata }) => metadata && metadata.rte_klasse === '4',
  properties: {
    hasInfos: true,
    useOverlay: true,
    popupComponent: 'BeleuchtungsPopup',
    layerInfoComponent: 'BeleuchtungLayerInfo',
    isQueryable: true,
  },
});

const createMapsGeoAdminStyleLayer = (key) => {
  return new MapboxStyleLayer({
    name: key,
    key,
    visible: false,
    mapboxLayer: beleuchtungDataLayer,
    styleLayersFilter: ({ id }) => id === key,
    properties: {
      legendKey: key,
      hasInfos: true,
      layerInfoComponent: 'MapsGeoAdminLayerInfo',
      isQueryable: true,
    },
  });
};

const mapsGeoAdminSchutzgebieteLayerKeys = [
  'ch.bafu.wrz-jagdbanngebiete_select',
  'ch.bafu.wrz-wildruhezonen_portal',
  'ch.bafu.waldreservate',
  'ch.bafu.unesco-weltnaturerbe',
  'ch.bak.schutzgebiete-unesco_weltkulturerbe',
  'ch.bafu.schutzgebiete-smaragd',
  'ch.bafu.schutzgebiete-paerke_nationaler_bedeutung_perimeter',
  'ch.bafu.schutzgebiete-ramsar',
  'ch.pronatura.naturschutzgebiete',
  'ch.bafu.schutzgebiete-biosphaerenreservate',
];

export const beleuchtungstaerkenSchutzgebieteLayer = new MapsGeoAdminLayer({
  name: 'ch.sbb.beleuchtungsstaerken.bafu-schutzgebiete.group',
  visible: false,
  children: mapsGeoAdminSchutzgebieteLayerKeys.map(
    createMapsGeoAdminStyleLayer,
  ),
  properties: {
    featureInfoEventTypes: ['singleclick'],
    useOverlay: true,
    popupComponent: 'MapsGeoAdminPopup',
    isQueryable: true,
  },
});

const mapsGeoAdminBundesinventareLayerKeys = [
  'ch.bafu.bundesinventare-vogelreservate',
  'ch.bafu.bundesinventare-auen_vegetation_alpin',
  'ch.bafu.bundesinventare-trockenwiesen_trockenweiden_anhang2',
  'ch.bafu.bundesinventare-trockenwiesen_trockenweiden',
  'ch.bafu.bundesinventare-moorlandschaften',
  'ch.bafu.bundesinventare-bln',
  'ch.bafu.bundesinventare-jagdbanngebiete',
  'ch.bafu.bundesinventare-hochmoore',
  'ch.bafu.bundesinventare-flachmoore',
  'ch.bafu.bundesinventare-auen_anhang2',
  'ch.bafu.bundesinventare-auen',
  'ch.bafu.bundesinventare-amphibien_wanderobjekte',
  'ch.bafu.bundesinventare-amphibien',
  'ch.bafu.bundesinventare-amphibien_anhang4',
];

export const beleuchtungstaerkenBundesInventareLayer = new MapsGeoAdminLayer({
  name: 'ch.sbb.beleuchtungsstaerken.bafu-bundesinventare.group',
  visible: false,
  children: mapsGeoAdminBundesinventareLayerKeys.map(
    createMapsGeoAdminStyleLayer,
  ),
  properties: {
    featureInfoEventTypes: ['singleclick'],
    useOverlay: true,
    popupComponent: 'MapsGeoAdminPopup',
    isQueryable: true,
  },
});

export default [
  beleuchtungDataLayer,
  beleuchtungstaerkenBundesInventareLayer,
  beleuchtungstaerkenSchutzgebieteLayer,
  beleuchtungstaerken4Layer,
  beleuchtungstaerken3Layer,
  beleuchtungstaerken2bLayer,
  beleuchtungstaerken2aLayer,
  beleuchtungstaerken1Layer,
];
