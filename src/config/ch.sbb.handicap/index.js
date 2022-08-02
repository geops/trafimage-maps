import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';

import {
  netzkarteLayer,
  netzkarteNight,
  netzkarteAerial,
  stationsLayer,
  bahnhofplaene,
  swisstopoLandeskarte,
  swisstopoLandeskarteGrau,
} from '../ch.sbb.netzkarte';

export const handicapDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.handicap.data',
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2_ch.sbb.handicap',
  properties: {
    hideInLegend: true,
  },
});

export const stuetzpunktBahnhoefe = new MapboxStyleLayer({
  name: 'ch.sbb.stuetzpunktbahnhoefe',
  key: 'ch.sbb.stuetzpunktbahnhoefe',
  visible: true,
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata['trafimage.filter'] === 'stuetzpunkt',
  properties: {
    handicapType: 'stuetzpunkt',
    hasInfos: true,
    layerInfoComponent: 'HandicapLayerInfo',
    popupComponent: 'HandicapPopup',
    useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
  },
  hidePopup: (feat, layer, featureInfo) => {
    const otherFeatsClicked = featureInfo
      .filter((info) => info.layer !== layer)
      .map((info) => info.features)
      .flat()
      .map((f) => f.get('stationsbezeichnung'));

    return otherFeatsClicked.includes(feat.get('stationsbezeichnung'));
  },
});

export const barrierfreierBahnhoefe = new MapboxStyleLayer({
  name: 'ch.sbb.barrierfreierbahnhoefe',
  key: 'ch.sbb.barrierfreierbahnhoefe',
  visible: true,
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata['trafimage.filter'] === 'barrierefrei',
  properties: {
    handicapType: 'barrierfree',
    hasInfos: true,
    layerInfoComponent: 'HandicapLayerInfo',
    popupComponent: 'HandicapPopup',
    useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
  },
});

export const nichtBarrierfreierBahnhoefe = new MapboxStyleLayer({
  name: 'ch.sbb.nichtbarrierfreierbahnhoefe',
  key: 'ch.sbb.nichtbarrierfreierbahnhoefe',
  visible: true,
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata['trafimage.filter'] === 'nicht_barrierefrei',
  properties: {
    handicapType: 'notBarrierfree',
    hasInfos: true,
    layerInfoComponent: 'HandicapLayerInfo',
    popupComponent: 'HandicapPopup',
    useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
  },
});

export default [
  handicapDataLayer,
  netzkarteLayer.clone({
    mapboxLayer: handicapDataLayer,
    style: 'base_bright_v2_ch.sbb.handicap',
  }),
  netzkarteNight.clone({
    mapboxLayer: handicapDataLayer,
    style: 'base_dark_v2_ch.sbb.handicap',
  }),
  netzkarteAerial.clone({
    mapboxLayer: handicapDataLayer,
    style: 'aerial_sbb_ch.sbb.handicap',
  }),
  swisstopoLandeskarte.clone({
    mapboxLayer: handicapDataLayer,
    style: 'ch.swisstopo.backgrounds_ch.sbb.handicap',
  }),
  swisstopoLandeskarteGrau.clone({
    mapboxLayer: handicapDataLayer,
    style: 'ch.swisstopo.backgrounds_ch.sbb.handicap',
  }),
  stationsLayer.clone({
    mapboxLayer: handicapDataLayer,
  }),
  bahnhofplaene.clone({
    children: bahnhofplaene.children.map((layer) =>
      layer.clone({
        mapboxLayer: handicapDataLayer,
      }),
    ),
  }),
  nichtBarrierfreierBahnhoefe,
  barrierfreierBahnhoefe,
  stuetzpunktBahnhoefe,
];
