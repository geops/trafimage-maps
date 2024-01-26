import { MesswagenLayer } from "../../layers";
import {
  dataLayer,
  netzkarteLayer,
  netzkarteNight,
  netzkarteAerial,
  swisstopoLandeskarte,
  swisstopoLandeskarteGrau,
} from "../ch.sbb.netzkarte";

const messwagenDataLayer = dataLayer.clone({
  key: `ch.sbb.funkmesswagen.data`,
  visible: true,
});

const messwagenNetzkarte = netzkarteLayer.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.funkmesswagen.netzkarte`,
  visible: false,
});

const messwagenNetzkarteNight = netzkarteNight.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.funkmesswagen.netzkarte.night`,
  visible: true,
});

const messwagenNetzkarteAerial = netzkarteAerial.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.funkmesswagen.aerial`,
  visible: true,
});

const messwagenLandeskarte = swisstopoLandeskarte.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.funkmesswagen.landeskarte`,
  visible: false,
});

const messwagenLandeskarteGrau = swisstopoLandeskarteGrau.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.funkmesswagen.landeskartegrau`,
  visible: false,
});

const mewa12 = new MesswagenLayer({
  name: "ch.sbb.funkmesswagen.mewa12",
  group: "ch.sbb.funkmesswagen",
  visible: true,
  properties: {
    fileName: "mewa12",
  },
});

const mb = new MesswagenLayer({
  name: "ch.sbb.funkmesswagen.mb",
  group: "ch.sbb.funkmesswagen",
  visible: false,
  properties: {
    fileName: "mb",
  },
});

const mobile = new MesswagenLayer({
  name: "ch.sbb.funkmesswagen.mobile",
  group: "ch.sbb.funkmesswagen",
  visible: false,
  properties: {
    fileName: "mobile",
  },
});

export default [
  messwagenDataLayer,
  messwagenNetzkarte,
  messwagenNetzkarteNight,
  messwagenNetzkarteAerial,
  messwagenLandeskarte,
  messwagenLandeskarteGrau,
  mobile,
  mb,
  mewa12,
];
