import { Layer } from 'mobility-toolbox-js/ol';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import ZweitausbildungAbroadLayer from '../../layers/ZweitausbildungAbroadLayer';
import ZweitausbildungPoisLayer from '../../layers/ZweitausbildungPoisLayer';
import ZweitausbildungRoutesLayer from '../../layers/ZweitausbildungRoutesLayer';
import ZweitausbildungRoutesHighlightLayer from '../../layers/ZweitausbildungRoutesHighlightLayer';

export const zweitausbildungDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.zweitausbildung',
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1,
  style: 'base_bright_v2_ch.sbb.zweitausbildung',
  properties: {
    hideInLegend: true,
  },
});

export const zweitausbildungAbroad = new ZweitausbildungAbroadLayer({
  name: 'ch.sbb.zweitausbildung.abroad',
  key: 'ch.sbb.zweitausbildung.abroad',
  visible: true,
  zIndex: 2,
  properties: {
    popupComponent: 'ZweitausbildungAbroadPopup',
    hasInfos: true,
    layerInfoComponent: 'ZweitausbildungLayerInfo',
    zweitausbildung: {
      infos: {
        title: 'ch.sbb.zweitausbildung.abroad-title',
        legend: {
          image: 'button_rectangle.png',
          name: 'ch.sbb.zweitausbildung.abroad-name',
        },
      },
    },
  },
});

export const zweitausbildungStations = new Layer({
  name: 'ch.sbb.zweitausbildung.stationen.group',
  visible: true,
  isQueryable: false,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'ZweitausbildungLayerInfo',
    zweitausbildung: {
      infos: {
        title: 'ch.sbb.zweitausbildung.stationen.group-title',
      },
    },
  },
  children: [
    new MapboxStyleLayer({
      name: 'ch.sbb.zweitausbildung.haltestellen.aufbau',
      isQueryable: false,
      zIndex: 3,
      mapboxLayer: zweitausbildungDataLayer,
      styleLayersFilter: ({ metadata }) =>
        !!metadata && /stations\.aufbau/.test(metadata['trafimage.filter']),
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungSubLayerInfo',
        zweitausbildung: {
          infos: {
            title: 'ch.sbb.zweitausbildung.haltestellen.aufbau-title',
            legend: [
              {
                image: 'station_aufbau.png',
                name: 'ch.sbb.zweitausbildung.haltestellen-stations',
              },
              {
                image: 'station_aufbau_grenzstation.png',
                name: 'ch.sbb.zweitausbildung.haltestellen-border-stations',
              },
            ],
          },
        },
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.zweitausbildung.haltestellen.basis',
      isQueryable: false,
      zIndex: 3,
      mapboxLayer: zweitausbildungDataLayer,
      styleLayersFilter: ({ metadata }) =>
        !!metadata && /stations\.basis/.test(metadata['trafimage.filter']),
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungSubLayerInfo',
        zweitausbildung: {
          infos: {
            title: 'ch.sbb.zweitausbildung.haltestellen.basis-title',
            legend: [
              {
                image: 'station_basis.png',
                name: 'ch.sbb.zweitausbildung.haltestellen-stations',
              },
              {
                image: 'station_basis_grenzstation.png',
                name: 'ch.sbb.zweitausbildung.haltestellen-border-stations',
              },
            ],
          },
        },
      },
    }),
  ],
});

export const zweitausbildungPois = new Layer({
  name: 'ch.sbb.zweitausbildung.tourist.pois.group',
  visible: true,
  isQueryable: false,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'ZweitausbildungLayerInfo',
    zweitausbildung: {
      infos: {
        title: 'ch.sbb.zweitausbildung.tourist.pois.group-title',
      },
    },
  },
  children: [
    new ZweitausbildungPoisLayer({
      name: 'ch.sbb.zweitausbildung.tourist.pois.no_railaway',
      key: 'ch.sbb.zweitausbildung.tourist.pois.no_railaway',
      visible: true,
      zIndex: 4,
      mapboxLayer: zweitausbildungDataLayer,
      styleLayersFilter: ({ metadata }) => {
        return (
          !!metadata &&
          /clusters\.no_railaway/.test(metadata['trafimage.filter'])
        );
      },
      properties: {
        useOverlay: true,
        popupComponent: 'ZweitausbildungPoisPopup',
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungSubLayerInfo',
        zweitausbildung: {
          sourceId: 'clusters.no_railaway',
          filter: ['==', 'rail_away', false],
          infos: {
            legend: [
              {
                image: 'poi_no_railaway.png',
                name: 'ch.sbb.zweitausbildung.tourist.pois.no_railaway-name',
              },
            ],
          },
        },
      },
    }),
    new ZweitausbildungPoisLayer({
      name: 'ch.sbb.zweitausbildung.tourist.pois.railaway',
      key: 'ch.sbb.zweitausbildung.tourist.pois.railaway',
      visible: true,
      zIndex: 4,
      mapboxLayer: zweitausbildungDataLayer,
      styleLayersFilter: ({ metadata }) => {
        return (
          !!metadata && /clusters\.railaway/.test(metadata['trafimage.filter'])
        );
      },
      properties: {
        useOverlay: true,
        popupComponent: 'ZweitausbildungPoisPopup',
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungSubLayerInfo',
        zweitausbildung: {
          sourceId: 'clusters.railaway',
          filter: ['==', 'rail_away', true],
          infos: {
            legend: [
              {
                image: 'poi_railaway.png',
                name: 'ch.sbb.zweitausbildung.tourist.pois.railaway-name',
              },
            ],
          },
        },
      },
    }),
  ],
});

export const zweitausbildungRoutes = new Layer({
  name: 'ch.sbb.zweitausbildung.linien.group',
  visible: true,
  isQueryable: false,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'ZweitausbildungLayerInfo',
    zweitausbildung: {
      infos: {
        title: 'ch.sbb.zweitausbildung.linien.group-title',
      },
    },
  },
  children: [
    new ZweitausbildungRoutesLayer({
      name: 'ch.sbb.zweitausbildung.tourist.routes.group',
      key: 'ch.sbb.zweitausbildung.tourist.routes.group',
      isAlwaysExpanded: true,
      visible: false,
      mapboxLayer: zweitausbildungDataLayer,
      isQueryable: false,
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungRoutesSubLayerInfo',
        radioGroup: 'zweitausbildungRoutes',
        zweitausbildung: {
          property: 'touristische_linie',
          infos: {
            title: 'ch.sbb.zweitausbildung.tourist.routes.group',
            desc: 'ch.sbb.zweitausbildung.tourist.routes.group-desc',
            legend: {
              image: 'legend_tourist_strecken.png',
            },
          },
          layer: 'zweitausbildung_tourist_strecken_grouped_qry',
        },
      },
      children: [
        new ZweitausbildungRoutesHighlightLayer({
          name: 'ch.sbb.zweitausbildung.tourist.routes.grouped',
          visible: false,
          zIndex: 1,
          mapboxLayer: zweitausbildungDataLayer,
          properties: {
            useOverlay: true,
            popupComponent: 'ZweitausbildungRoutesPopup',
            zweitausbildung: {
              property: 'touristische_linie',
              layer: 'zweitausbildung_tourist_strecken',
              featureInfoLayer: 'zweitausbildung_tourist_strecken_qry_xyr',
            },
          },
        }),
      ],
    }),
    new ZweitausbildungRoutesLayer({
      name: 'ch.sbb.zweitausbildung.hauptlinien.group',
      visible: true,
      isQueryable: false,
      isAlwaysExpanded: true,
      mapboxLayer: zweitausbildungDataLayer,
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungRoutesSubLayerInfo',
        zweitausbildung: {
          property: 'hauptlinie',
          infos: {
            title: 'ch.sbb.zweitausbildung.hauptlinien.group',
            desc: 'ch.sbb.zweitausbildung.hauptlinien.group-desc',
            legend: {
              image: 'legend_hauptlinien.png',
            },
          },
          layer: 'zweitausbildung_hauptlinien_grouped_qry',
        },
        radioGroup: 'zweitausbildungRoutes',
      },
      children: [
        new ZweitausbildungRoutesHighlightLayer({
          name: 'ch.sbb.zweitausbildung.hauptlinien.grouped',
          visible: true,
          zIndex: 1,
          mapboxLayer: zweitausbildungDataLayer,
          properties: {
            useOverlay: true,
            popupComponent: 'ZweitausbildungRoutesPopup',
            zweitausbildung: {
              property: 'hauptlinie',
              layer: 'zweitausbildung_hauptlinien',
              featureInfoLayer: 'zweitausbildung_hauptlinien_qry_xyr',
            },
          },
        }),
      ],
    }),
  ],
});

export default [
  zweitausbildungDataLayer,
  zweitausbildungRoutes,
  zweitausbildungAbroad,
  zweitausbildungPois,
  zweitausbildungStations,
];
