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
  key: `ch.sbb.messwagen.data`,
  visible: true,
});

const messwagenNetzkarte = netzkarteLayer.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.messwagen.netzkarte`,
  visible: false,
});

const messwagenNetzkarteNight = netzkarteNight.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.messwagen.netzkarte.night`,
  visible: true,
});

const messwagenNetzkarteAerial = netzkarteAerial.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.messwagen.aerial`,
  visible: true,
});

const messwagenLandeskarte = swisstopoLandeskarte.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.messwagen.landeskartegrau`,
  visible: false,
});

const messwagenLandeskarteGrau = swisstopoLandeskarteGrau.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.messwagen.landeskartegrau`,
  visible: false,
});

const mewa12 = new MesswagenLayer({
  name: "ch.sbb.messwagen.mewa12",
  group: "ch.sbb.messwagen",
  visible: true,
  properties: {
    fileName: "mewa12",
  },
});

const mb = new MesswagenLayer({
  name: "ch.sbb.messwagen.mb",
  group: "ch.sbb.messwagen",
  visible: false,
  properties: {
    fileName: "mb",
  },
});

const mobile = new MesswagenLayer({
  name: "ch.sbb.messwagen.mobile",
  group: "ch.sbb.messwagen",
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
