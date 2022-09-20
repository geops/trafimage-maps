import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import StationsLayer from '../../layers/StationsLayer';
import {
  dataLayer,
  netzkarteLayer,
  netzkarteAerial,
} from '../ch.sbb.netzkarte';

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

const casaNetzkarteAerial = netzkarteAerial.clone({
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
    isQueryable: true,
  },
});

// Add stations (blue style on hover) to labelsDataLayer.
const casaNetzkarteStationsLayer = new StationsLayer({
  name: 'ch.sbb.netzkarte.stationen.casa',
  mapboxLayer: casaNetzkarteLayerWithLabels,
});

export default [
  casaDataLayerWithoutLabels,
  casaNetzkarteLayerWithoutLabels,
  casaNetzkarteAerial,
  casaNetzkarteLayerWithLabels,
  casaNetzkarteStationsLayer,
];
