import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import { kilometrageLayer } from '../ch.sbb.infrastruktur';

export const netzentwicklungDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.data',
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1,
  style: 'netzkarte_eisenbahninfrastruktur_v3_ch.sbb.netzentwicklung',
  properties: {
    hideInLegend: true,
  },
});

export const netzentwicklungProgrammManagerLayer = new MapboxStyleLayer({
  name: 'ch.sbb.netzentwicklung.programm_manager',
  mapboxLayer: netzentwicklungDataLayer,
  visible: false,
  styleLayersFilter: ({ id }) => /programm_manager$/.test(id),
  properties: {
    radioGroup: 'netzentwicklung',
    popupComponent: 'NetzentwicklungPopup',
    netzentwicklungRoleType: 'Programm Manager', // display only roles of this type
    hasInfos: true,
    useOverlay: true,
    layerInfoComponent: 'NetzentwicklungLayerInfo',
  },
});

export const netzentwicklungSkPlanerLayer = new MapboxStyleLayer({
  name: 'ch.sbb.netzentwicklung.sk_planer',
  mapboxLayer: netzentwicklungDataLayer,
  visible: true,
  styleLayersFilter: ({ id }) => /sk_planer$/.test(id),
  properties: {
    radioGroup: 'netzentwicklung',
    popupComponent: 'NetzentwicklungPopup',
    netzentwicklungRoleType: 'S&K Planer', // display only roles of this type
    hasInfos: true,
    useOverlay: true,
    layerInfoComponent: 'NetzentwicklungLayerInfo',
  },
});

export const netzentwicklungStrategischLayer = new MapboxStyleLayer({
  name: 'ch.sbb.netzentwicklung.strategisch',
  mapboxLayer: netzentwicklungDataLayer,
  visible: false,
  styleLayersFilter: ({ id }) => /strategisch$/.test(id),
  properties: {
    radioGroup: 'netzentwicklung',
    popupComponent: 'NetzentwicklungPopup',
    netzentwicklungRoleType: 'Netzentwickler Strategisch', // display only roles of this type
    hasInfos: true,
    useOverlay: true,
    layerInfoComponent: 'NetzentwicklungLayerInfo',
  },
});

export default [
  kilometrageLayer,
  netzentwicklungDataLayer,
  netzentwicklungStrategischLayer,
  netzentwicklungProgrammManagerLayer,
  netzentwicklungSkPlanerLayer,
];