import { MesswagenLayer } from "../../layers";
import { dataLayer, netzkarteAerial } from "../ch.sbb.netzkarte";

const messwagenDataLayer = dataLayer.clone({
  key: `ch.sbb.messwagen.data`,
  visible: true,
});

const messwagenAerial = netzkarteAerial.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.messwagen.aerial`,
  visible: true,
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

export default [messwagenDataLayer, messwagenAerial, mobile, mb, mewa12];
