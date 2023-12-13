import { unByKey } from 'ol/Observable';
import { Layer } from 'mobility-toolbox-js/ol';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';

import {
  netzkarteLayer,
  netzkarteNight,
  // netzkarteAerial,
  stationsLayer,
  bahnhofplaene,
  // swisstopoLandeskarte,
  // swisstopoLandeskarteGrau,
} from '../ch.sbb.netzkarte';

export const handicapDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.handicap.data',
  visible: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2_ch.sbb.handicap_v2',
  properties: {
    hideInLegend: true,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
  group: 'data',
});

let layersToQuery = [];

const clusterBarrierfrei = new MapboxStyleLayer({
  name: 'ch.sbb.barrierfreierbahnhoefe',
  key: 'ch.sbb.barrierfreierbahnhoefe-cluster',
  mapboxLayer: handicapDataLayer,
  properties: {
    filter: ['==', ['get', 'prmAutonomyState'], 'YES'],
  },
});

const clusterNichtBarrierfrei = new MapboxStyleLayer({
  name: 'ch.sbb.nichtbarrierfreierbahnhoefe',
  key: 'ch.sbb.nichtbarrierfreierbahnhoefe-cluster',
  mapboxLayer: handicapDataLayer,
  properties: {
    filter: ['!=', ['get', 'prmAutonomyState'], 'YES'],
  },
});

const clusterLayerFilter = [clusterNichtBarrierfrei, clusterBarrierfrei];

export const updateStations = (mbMap) => {
  const filter = ['any'];
  clusterLayerFilter.forEach((l) => {
    if (l.visible) {
      filter.push(l.get('filter'));
    }
  });
  layersToQuery.forEach((layerId) => {
    mbMap.setFilter(layerId, filter);
  });

  // Modifying the source triggers an idle state so we use "once" to avoid an infinite loop.
  mbMap.once('idle', () => {
    const features = mbMap
      .queryRenderedFeatures({
        layers: layersToQuery,
      })
      .map((feat) => {
        const good = {
          id: feat.id * 1000,
          type: feat.type,
          properties: feat.properties,
          geometry: feat.geometry,
        };
        return good;
      });
    const source = mbMap.getSource('clusters');
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features,
      });
    }
  });
};
const olKeys = [];
handicapDataLayer.on('load', () => {
  const { map, mbMap } = handicapDataLayer;
  layersToQuery = mbMap
    .getStyle()
    .layers.filter(({ metadata }) => {
      return /^cluster.data/.test(metadata?.['handicap.filter']);
    })
    .map((layer) => layer.id);

  updateStations(mbMap);

  // Update clusters source on moveeend.
  unByKey(olKeys);

  olKeys.push(
    map.on('moveend', () => {
      // [constrAusbau, constrUnterhalt].forEach((layer) => {
      //   // eslint-disable-next-line no-param-reassign
      //   layer.isQueryable = map.getView().getZoom() > 10;
      // });
      updateStations(mbMap);
    }),
  );
});

export const cluster = new MapboxStyleLayer({
  name: 'With cluster',
  visible: true,
  mapboxLayer: handicapDataLayer,
  group: 'test',
  styleLayersFilter: ({ metadata }) => {
    return /^cluster/.test(metadata?.['handicap.filter']);
  },
  properties: {
    isQueryable: false,
    hideInLegend: false,
    cluster: true,
  },
  children: [
    new MapboxStyleLayer({
      mapboxLayer: handicapDataLayer,
      styleLayersFilter: ({ metadata }) => {
        return /^cluster.symbol/.test(metadata?.['handicap.filter']);
      },
      properties: {
        hideInLegend: true,
        isQueryable: true,
        useOverlay: true,
        popupComponent: 'StopPlacePopup',
      },
    }),
    ...clusterLayerFilter,
  ],
});

clusterLayerFilter.forEach((layer) => {
  layer.on('change:visible', ({ target }) => {
    // Re-render only for children that contribute to the cluster
    if (target.mapboxLayer && handicapDataLayer && handicapDataLayer.mbMap) {
      updateStations(target.mapboxLayer.mbMap);
    }
  });
});

const barrierfrei = new MapboxStyleLayer({
  name: 'ch.sbb.barrierfreierbahnhoefe',
  mapboxLayer: handicapDataLayer,
  visible: false,
  styleLayersFilter: ({ metadata }) => {
    return /^symbol.barrierfrei/.test(metadata?.['handicap.filter']);
  },
  properties: {
    isQueryable: true,
    popupComponent: 'StopPlacePopup',
    useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
  },
});

const nichtBarrierfrei = new MapboxStyleLayer({
  name: 'ch.sbb.nichtbarrierfreierbahnhoefe',
  mapboxLayer: handicapDataLayer,
  visible: false,
  styleLayersFilter: ({ metadata }) => {
    return /^symbol.nichtbarrierfrei/.test(metadata?.['handicap.filter']);
  },
  properties: {
    isQueryable: true,
    // hasInfos: true,
    // layerInfoComponent: 'HandicapLayerInfo',
    popupComponent: 'StopPlacePopup',
    useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
  },
});

export const withoutCluster = new Layer({
  name: 'Without cluster',
  visible: false,
  group: 'test',
  // !!metadata && metadata['trafimage.filter'] === 'stuetzpunkt',
  children: [nichtBarrierfrei, barrierfrei],
});

// TODO: keep this layer until we are sure we will not use it.
// export const stuetzpunktBahnhoefe = new MapboxStyleLayer({
//   name: 'ch.sbb.stuetzpunktbahnhoefe',
//   key: 'ch.sbb.stuetzpunktbahnhoefe',
//   visible: true,
//   mapboxLayer: handicapDataLayer,
//   styleLayersFilter: ({ metadata }) =>
//     !!metadata && metadata['trafimage.filter'] === 'stuetzpunkt',
//   properties: {
//     isQueryable: true,
//     handicapType: 'stuetzpunkt',
//     hasInfos: true,
//     layerInfoComponent: 'HandicapLayerInfo',
//     popupComponent: 'HandicapPopup',
//     useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
//   },
//   hidePopup: (feat, layer, featureInfo) => {
//     const otherFeatsClicked = featureInfo
//       .filter((info) => info.layer !== layer)
//       .map((info) => info.features)
//       .flat()
//       .map((f) => f.get('stationsbezeichnung'));

//     return otherFeatsClicked.includes(feat.get('stationsbezeichnung'));
//   },
// });

// TODO: keep this layer until we are sure we will not use it.
// export const barrierfreierBahnhoefe = new MapboxStyleLayer({
//   name: 'ch.sbb.barrierfreierbahnhoefe',
//   key: 'ch.sbb.barrierfreierbahnhoefe',
//   visible: true,
//   mapboxLayer: handicapDataLayer,
//   styleLayersFilter: ({ metadata }) =>
//     !!metadata && metadata['trafimage.filter'] === 'barrierefrei',
//   properties: {
//     isQueryable: true,
//     handicapType: 'barrierfree',
//     hasInfos: true,
//     layerInfoComponent: 'HandicapLayerInfo',
//     popupComponent: 'HandicapPopup',
//     useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
//   },
// });

// TODO: keep this layer until we are sure we will not use it.
// export const nichtBarrierfreierBahnhoefe = new MapboxStyleLayer({
//   name: 'ch.sbb.nichtbarrierfreierbahnhoefe',
//   key: 'ch.sbb.nichtbarrierfreierbahnhoefe',
//   visible: true,
//   mapboxLayer: handicapDataLayer,
//   styleLayersFilter: ({ metadata }) =>
//     !!metadata && metadata['trafimage.filter'] === 'nicht_barrierefrei',
//   properties: {
//     isQueryable: true,
//     handicapType: 'notBarrierfree',
//     hasInfos: true,
//     layerInfoComponent: 'HandicapLayerInfo',
//     popupComponent: 'HandicapPopup',
//     useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
//   },
// });

export default [
  handicapDataLayer,
  netzkarteLayer.clone({
    mapboxLayer: handicapDataLayer,
    style: 'base_bright_v2_ch.sbb.handicap_v2',
  }),
  netzkarteNight.clone({
    mapboxLayer: handicapDataLayer,
    style: 'base_dark_v2_ch.sbb.handicap_v2',
  }),
  // netzkarteAerial.clone({
  //   mapboxLayer: handicapDataLayer,
  //   style: 'aerial_sbb_sbbkey_ch.sbb.handicap_v2',
  // }),
  // swisstopoLandeskarte.clone({
  //   mapboxLayer: handicapDataLayer,
  //   style: 'ch.swisstopo.backgrounds_ch.sbb.handicap_v2',
  // }),
  // swisstopoLandeskarteGrau.clone({
  //   mapboxLayer: handicapDataLayer,
  //   style: 'ch.swisstopo.backgrounds_ch.sbb.handicap_v2',
  // }),
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
  cluster,
  withoutCluster,
  // nichtBarrierfreierBahnhoefe,
  // barrierfreierBahnhoefe,
  // stuetzpunktBahnhoefe,
];
