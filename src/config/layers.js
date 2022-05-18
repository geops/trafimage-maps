import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { Layer } from 'mobility-toolbox-js/ol';
import MapboxStyleLayer from '../layers/MapboxStyleLayer';
import TrafimageMapboxLayer from '../layers/TrafimageMapboxLayer';
import ZweitausbildungAbroadLayer from '../layers/ZweitausbildungAbroadLayer';
import ZweitausbildungPoisLayer from '../layers/ZweitausbildungPoisLayer';
import ZweitausbildungRoutesLayer from '../layers/ZweitausbildungRoutesLayer';
import ZweitausbildungRoutesHighlightLayer from '../layers/ZweitausbildungRoutesHighlightLayer';
import { dataLayer } from './ch.sbb.netzkarte';

proj4.defs(
  'EPSG:21781',
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 ' +
    '+x_0=600000 +y_0=200000 +ellps=bessel ' +
    '+towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
);

proj4.defs(
  'EPSG:2056',
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 ' +
    '+x_0=2600000 +y_0=1200000 +ellps=bessel ' +
    '+towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
);

register(proj4);

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

export const zweitausbildungStationsDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.zweitausbildung_stations',
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1,
  style: 'ch.sbb.zweitausbildung_stations',
  properties: {
    hideInLegend: true,
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
      mapboxLayer: zweitausbildungStationsDataLayer,
      styleLayersFilter: (styleLayer) =>
        /ch\.sbb\.zweitausbildung_stations\.aufbau/.test(styleLayer.id),
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
      mapboxLayer: zweitausbildungStationsDataLayer,
      styleLayersFilter: (styleLayer) =>
        /ch\.sbb\.zweitausbildung_stations\.basis/.test(styleLayer.id),
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

export const zweitausbildungPoisDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.zweitausbildung_pois',
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1,
  style: 'ch.sbb.zweitausbildung_pois',
  properties: {
    hideInLegend: true,
  },
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
      mapboxLayer: zweitausbildungPoisDataLayer,
      properties: {
        useOverlay: true,
        popupComponent: 'ZweitausbildungPoisPopup',
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungSubLayerInfo',
        zweitausbildung: {
          filter: ['==', 'rail_away', false],
          color: 'rgba(0, 61, 133, 0.8)',
          icon: 'flag_blue',
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
      mapboxLayer: zweitausbildungPoisDataLayer,
      properties: {
        useOverlay: true,
        popupComponent: 'ZweitausbildungPoisPopup',
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungSubLayerInfo',
        zweitausbildung: {
          filter: ['==', 'rail_away', true],
          color: 'rgba(235, 0, 0, 0.8)',
          icon: 'flag_red',
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
      mapboxLayer: dataLayer,
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
          mapboxLayer: dataLayer,
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
      mapboxLayer: dataLayer,
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
          mapboxLayer: dataLayer,
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
