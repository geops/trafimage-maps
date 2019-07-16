import { defaultBaseLayers } from './layers';

export default {
  'ch.sbb.netzkarte': {
    name: 'ÖV Netzkarte Schweiz',
    layers: defaultBaseLayers,
    projection: 'EPSG:3857',
  },
  'ch.sbb.casa': {
    name: 'CASA',
    layers: defaultBaseLayers,
    projection: 'EPSG:3857',
  },
};
