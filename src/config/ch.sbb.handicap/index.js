import { unByKey } from 'ol/Observable';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';

import {
  netzkarteLayer,
  netzkarteNight,
  netzkarteAerial,
  // stationsLayer,
  // bahnhofplaene,
  swisstopoLandeskarte,
  swisstopoLandeskarteGrau,
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
});

const layersToQuery = ['unclustered-point'];

export const updateStations = (mbMap) => {
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
    mbMap.setLayerZoomRange('handicap-cluster-circle', 0, 20);
    mbMap.setLayerZoomRange('handicap-cluster-number', 0, 20);
    mbMap.setLayoutProperty('handicap-cluster-circle', 'visibility', 'visible');
    mbMap.setLayoutProperty('handicap-cluster-number', 'visibility', 'visible');
    mbMap.setFilter('handicap-cluster-circle', ['has', 'point_count']);
    // mbMap.setLayoutProperty('handicap_symbol', 'visibility', 'none');
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
  // layersToQuery = mbMap
  //   .getStyle()
  //   .layers.filter(({ source }) => {
  //     return source === 'stop_places';
  //   })
  //   .map((layer) => layer.id);

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
  name: 'ch.sbb.handicap-cluster',
  key: 'ch.sbb.handicap-cluster',
  visible: true,
  mapboxLayer: handicapDataLayer,
  group: 'test',
  properties: {
    isQueryable: false,
    hideInLegend: false,
    cluster: true,
  },
  children: [
    // style used to build to fill the cluster feature collection
    new MapboxStyleLayer({
      mapboxLayer: handicapDataLayer,
      styleLayers: [
        {
          id: 'unclustered-point',
          type: 'circle',
          source: 'stop_places',
          'source-layer': 'stop_place',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 1,
            'circle-opacity': 0,
          },
        },
      ],
      properties: {
        isQueryable: false,
        hideInLegend: true,
      },
    }),
    // style used to display the stop places when there is only one in cluster
    new MapboxStyleLayer({
      mapboxLayer: handicapDataLayer,
      styleLayers: [
        {
          filter: [
            'all',
            ['!', ['has', 'point_count']],
            [
              'match',
              ['get', 'meansOfTransport'],
              [
                'train',
                'train,other',
                'train,tram',
                'train,bus',
                'train,bus,tram',
              ],
              true,
              false,
            ],
          ],
          id: 'handicap_symbol_cluster',
          layout: {
            'icon-allow-overlap': false,
            'icon-ignore-placement': true,
            'icon-image': [
              'match',
              ['get', 'prmAutonomyState'],
              'YES',
              'green_yes',
              'PARTIAL',
              'orange_partial',
              'NO',
              'red_no',
              'UNKNOWN',
              'grey_unknown',
              'SHUTTLE',
              'cyan_shuttle',
              '122_circle-blue-notch-small-01',
            ],
            'text-field': '',
            'text-font': ['SBB Web Roman'],
            visibility: 'visible',
          },
          source: 'clusters',
          type: 'symbol',
        },
      ],
      properties: {
        hideInLegend: true,
        isQueryable: true,
        useOverlay: true,
        popupComponent: 'StopPlacePopup',
      },
    }),
  ],
  styleLayersFilter: ({ source }) => {
    return source === 'clusters';
  },
});

export const stuetzpunktBahnhoefe = new MapboxStyleLayer({
  name: 'ch.sbb.handicap-nocluster',
  key: 'ch.sbb.handicap-nocluster',
  visible: false,
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ id }) => id === 'handicap_symbol',
  group: 'test',

  // !!metadata && metadata['trafimage.filter'] === 'stuetzpunkt',
  properties: {
    isQueryable: true,
    // handicapType: 'stuetzpunkt',
    // hasInfos: true,
    hideInLegend: false,
    // layerInfoComponent: 'HandicapLayerInfo',
    popupComponent: 'StopPlacePopup',
    group: 'test',
    useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
  },
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

// Re-render cluster when change construction layers visiblity.
// [
//   stuetzpunktBahnhoefe,
//   // barrierfreierBahnhoefe,
//   // nichtBarrierfreierBahnhoefe,
// ].forEach((parentLayer) => {
//   parentLayer.children.forEach((l) => {
//     l.on('change:visible', ({ target: layer }) => {
//       // Re-render only for children that contribute to the cluster
//       if (layer.mapboxLayer && handicapDataLayer && handicapDataLayer.mbMap) {
//         updateStations(layer.mapboxLayer.mbMap);
//       }
//     });
//   });
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
  netzkarteAerial.clone({
    mapboxLayer: handicapDataLayer,
    style: 'aerial_sbb_sbbkey_ch.sbb.handicap_v2',
  }),
  swisstopoLandeskarte.clone({
    mapboxLayer: handicapDataLayer,
    style: 'ch.swisstopo.backgrounds_ch.sbb.handicap_v2',
  }),
  swisstopoLandeskarteGrau.clone({
    mapboxLayer: handicapDataLayer,
    style: 'ch.swisstopo.backgrounds_ch.sbb.handicap_v2',
  }),
  cluster,
  // stationsLayer.clone({
  //   mapboxLayer: handicapDataLayer,
  // }),
  // bahnhofplaene.clone({
  //   children: bahnhofplaene.children.map((layer) =>
  //     layer.clone({
  //       mapboxLayer: handicapDataLayer,
  //     }),
  //   ),
  // }),
  // nichtBarrierfreierBahnhoefe,
  // barrierfreierBahnhoefe,
  stuetzpunktBahnhoefe,
];
