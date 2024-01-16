import React from "react";
import "./proj4";
import tarifverbundkarteLegend from "../img/tarifverbund_legend.url.svg";
import railplusLegendDe from "../img/railplus_legend_de.url.svg";
import railplusLegendFr from "../img/railplus_legend_fr.url.svg";
import railplusLegendIt from "../img/railplus_legend_it.url.svg";
import energieLegendPub from "../img/energie_legend_pub.url.svg";
import railPlusLayers from "./ch.railplus.mitglieder";
import netzkarteLayers, {
  dataLayer,
  netzkarteLayer,
  stationsLayer,
  bahnhofplaene,
} from "./ch.sbb.netzkarte";
import constructionLayers from "./ch.sbb.construction";
import handicapLayers from "./ch.sbb.handicap";
import infrastrukturLayers, {
  netzkarteEisenbahninfrastruktur,
  betriebsRegionenVisible,
} from "./ch.sbb.infrastruktur";
import energieLayers from "./ch.sbb.energie";
import tarifverbundkarteLayers from "./ch.sbb.tarifverbundkarte.public";
import regionenkarteLayers from "./ch.sbb.regionenkarte.public";
import netzentwicklungLayers from "./ch.sbb.netzentwicklung";
import beleuchtungLayers from "./ch.sbb.beleuchtungsstaerken";
import isbLayers from "./ch.sbb.isb";
import sandboxLayers from "./ch.sbb.netzkarte.sandbox";
import zweitausbildungLayers from "./ch.sbb.zweitausbildung";
import geltungsbereicheMvpLayers from "./ch.sbb.geltungsbereiche.mvp";
import geltungsbereicheIframeLayers from "./ch.sbb.geltungsbereiche.iframe";
import stsLayers from "./ch.sbb.sts";
import dvLayers from "./ch.sbb.direktverbindungen";
import defaultSearches, { handicapStopFinder } from "./searches";
import GeltungsbereicheTopicMenu from "../menus/GeltungsbereicheTopicMenu";
import StsMenu from "../menus/StsMenu";
import {
  DV_KEY,
  ONLY_WHEN_NOT_LOGGED_IN,
  PDF_DOWNLOAD_EVENT_TYPE,
  RAILPLUS_EXPORTBTN_ID,
} from "../utils/constants";
import DvMenu from "../menus/DirektverbindungenMenu/DvMenu";
import DvListButton from "./ch.sbb.direktverbindungen/DvListButton";
import applPermalinkVisiblity from "../utils/applyPermalinkVisibility";
import RailplusMenu from "../menus/RailplusMenu";
import RailplusExportButton from "./ch.railplus.mitglieder/RailplusExportButton";
import messwagenLayers from "./ch.sbb.messwagen";
import MesswagenFollowButton from "./ch.sbb.messwagen/MesswagenFollowButton";
import { MesswagenPopup } from "../popups";
// For backward compatibility
export {
  casaDataLayerWithoutLabels,
  casaNetzkarteLayerWithLabels,
  casaNetzkarteLayerWithoutLabels,
} from "./ch.sbb.casa";

export const defaultElements = {
  header: true,
  footer: true,
  menu: true,
  permalink: true,
  mapControls: true,
  baseLayerSwitcher: true,
  popup: true,
  search: true,
  drawMenu: true,
  overlay: true,
  geolocationButton: true,
};

export const netzkarte = {
  name: "ch.sbb.netzkarte.topic",
  key: "ch.sbb.netzkarte",
  elements: {
    ...defaultElements,
    popup: true,
    shareMenu: true,
    trackerMenu: true,
  },
  layers: netzkarteLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "NetzkarteTopicInfo",
  searches: defaultSearches,
};

export const handicap = {
  name: "ch.sbb.handicap",
  key: "ch.sbb.handicap",
  elements: {
    ...defaultElements,
    shareMenu: true,
    popup: true,
  },
  layers: handicapLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "HandicapTopicInfo",
  searches: {
    Stationen: handicapStopFinder,
  },
};

export const netzkarteStelen = {
  name: "ch.sbb.netzkarte.topic",
  key: "ch.sbb.netzkarte",
  layers: [dataLayer, netzkarteLayer, stationsLayer, bahnhofplaene],
  elements: {},
  projection: "EPSG:3857",
};

export const bauprojekte = {
  name: "ch.sbb.construction",
  key: "ch.sbb.construction",
  elements: {
    ...defaultElements,
    shareMenu: true,
    popup: true,
    filter: true,
    filters: true,
  },
  layers: constructionLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "ConstructionTopicInfo",
  searches: defaultSearches,
};

export const infrastruktur = {
  name: "ch.sbb.infrastruktur",
  key: "ch.sbb.infrastruktur",
  maxZoom: 14,
  elements: {
    ...defaultElements,
    shareMenu: true,
    popup: true,
  },
  layers: infrastrukturLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "InfrastrukturTopicInfo",
  searches: defaultSearches,
};

export const betriebsregionen = {
  name: "ch.sbb.infrastruktur",
  key: "ch.sbb.infrastruktur",
  elements: {
    ...defaultElements,
    header: false,
    search: false,
    drawMenu: false,
    popup: true,
  },
  layers: [netzkarteEisenbahninfrastruktur, betriebsRegionenVisible],
  projection: "EPSG:3857",
};

export const regionenkartePublic = {
  name: "ch.sbb.regionenkarte.public",
  key: "ch.sbb.regionenkarte.public",
  maxZoom: 13,
  elements: {
    ...defaultElements,
    popup: true,
    overlay: true,
  },
  layers: regionenkarteLayers,
  layerInfoComponent: "RegionenkartePublicTopicInfo",
  searches: defaultSearches,
};

export const tarifverbundkarte = {
  name: "ch.sbb.tarifverbundkarte.public",
  key: "ch.sbb.tarifverbundkarte.public",
  layerInfoComponent: "TarifverbundkarteTopicInfo",
  layers: tarifverbundkarteLayers,
  maxZoom: 12,
  exportConfig: {
    getTemplateValues: () => ({
      publisher: "tobias.hauser@sbb.ch",
      publishedAt: "12/2023",
      dateDe: "10.12.2023",
      dateFr: "10.12.2023",
      year: "2023",
    }),
    getOverlayImageUrl: () => tarifverbundkarteLegend,
  },
  elements: {
    ...defaultElements,
    popup: true,
    shareMenu: { collapsedOnLoad: true },
    trackerMenu: true,
    exportMenu: true,
    drawMenu: { collapsedOnLoad: true },
  },
  searches: defaultSearches,
};

export const zweitausbildung = {
  name: "ch.sbb.zweitausbildung",
  key: "ch.sbb.zweitausbildung",
  maxZoom: 13,
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: zweitausbildungLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "ZweitausbildungTopicInfo",
  searches: defaultSearches,
};

export const netzentwicklung = {
  name: "ch.sbb.netzentwicklung",
  key: "ch.sbb.netzentwicklung",
  maxZoom: 13,
  elements: { ...defaultElements, shareMenu: true, popup: true, overlay: true },
  layers: netzentwicklungLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "NetzentwicklungTopicInfo",
  searches: defaultSearches,
};

export const beleuchtungsstaerken = {
  name: "ch.sbb.beleuchtungsstaerken",
  key: "ch.sbb.beleuchtungsstaerken",
  maxZoom: 13,
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: beleuchtungLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "BeleuchtungTopicInfo",
  searches: defaultSearches,
};

export const energiePublic = {
  name: "ch.sbb.energie",
  key: "ch.sbb.energie",
  maxZoom: 14,
  elements: {
    ...defaultElements,
    shareMenu: true,
    popup: true,
    overlay: true,
    exportMenu: true,
  },
  exportConfig: {
    getTemplateValues: () => ({
      publisher: "I-EN-DAE-OAN-BUI, trassensicherung-energie@sbb.ch",
      publishedAt: () => {
        const date = new Date();
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
      },
      year: () => new Date().getFullYear(),
    }),
    getOverlayImageUrl: () => energieLegendPub,
  },
  layers: energieLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "EnergiePublicTopicInfo",
  searches: defaultSearches,
};

export const isb = {
  name: "ch.sbb.isb",
  key: "ch.sbb.isb",
  maxZoom: 14,
  elements: {
    ...defaultElements,
    shareMenu: true,
    popup: true,
  },
  layers: isbLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "IsbTopicInfo",
  searches: defaultSearches,
};

const sandbox = {
  name: "ch.sbb.netzkarte.sandbox",
  key: "ch.sbb.netzkarte.sandbox",
  layers: sandboxLayers,
  projection: "EPSG:3857",
  elements: {
    ...defaultElements,
  },
  layerInfoComponent: "SandboxTopicInfo",
  searches: defaultSearches,
};

export const geltungsbereicheMvp = {
  name: "ch.sbb.geltungsbereiche",
  key: "ch.sbb.geltungsbereiche",
  elements: {
    ...defaultElements,
    popup: true,
    shareMenu: true,
  },
  maxZoom: 14,
  layers: geltungsbereicheMvpLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "GeltungsbereicheTopicInfo",
  searches: defaultSearches,
};

export const geltungsbereicheIframe = {
  ...geltungsbereicheMvp,
  elements: {
    ...defaultElements,
    popup: true,
    shareMenu: false,
    drawMenu: false,
    permalink: true,
    geolocationButton: false,
    header: false,
    search: false,
    footer: false,
    menu: false,
  },
  key: "ch.sbb.geltungsbereiche-iframe",
  layers: geltungsbereicheIframeLayers,
  only: true,
  hideInLayerTree: true,
  menu: <GeltungsbereicheTopicMenu />,
};

export const sts = {
  name: "ch.sbb.sts",
  key: "ch.sbb.sts",
  elements: {
    ...defaultElements,
    overlay: false,
    popup: false,
    shareMenu: false,
    drawMenu: false,
    permalink: true,
    geolocationButton: false,
    header: false,
    search: false,
    footer: false,
    menu: false,
    menuToggler: true,
  },
  layers: stsLayers,
  only: true,
  hideInLayerTree: true,
  menu: <StsMenu />,
  enableFeatureClick: true,
  disablePermalinkLayers: false,
  center: [915788.3813658276, 5909670.533831286],
  zoom: 8,
  constrainOnlyCenter: true,
  overlaySide: "left",
};

export const direktverbindungen = {
  name: `${DV_KEY}.topic`,
  key: `${DV_KEY}`,
  elements: {
    ...defaultElements,
    popup: true,
    shareMenu: true,
    fitExtent: false,
  },
  maxZoom: 13,
  minZoom: 6,
  layers: dvLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "DvTopicInfo",
  searches: defaultSearches,
  mapControls: <DvListButton />,
};

export const direktverbindungenIframe = {
  name: `${DV_KEY}-iframe.topic`,
  key: `${DV_KEY}-iframe`,
  elements: {
    ...defaultElements,
    overlay: false,
    popup: false,
    shareMenu: false,
    drawMenu: false,
    permalink: true,
    geolocationButton: true,
    header: false,
    search: false,
    footer: false,
    menu: false,
    baseLayerSwitcher: false,
    fitExtent: false,
  },
  maxZoom: 13,
  minZoom: 6,
  layers: dvLayers,
  enableFeatureClick: true,
  only: true,
  hideInLayerTree: true,
  menu: <DvMenu />,
  mapControls: <DvListButton />,
  overlaySide: "left",
};

export const railPlus = {
  elements: {
    ...defaultElements,
    overlay: false,
    popup: false,
    shareMenu: false,
    drawMenu: false,
    permalink: true,
    geolocationButton: false,
    header: false,
    search: false,
    footer: false,
    menu: false,
  },
  key: "ch.railplus.mitglieder",
  layers: railPlusLayers,
  only: true,
  hideInLayerTree: true,
  enableFeatureClick: true,
  mapControls: <RailplusExportButton />,
  menu: <RailplusMenu />,
  embedded: true,
  overlaySide: "left",
  messageEvents: [
    {
      eventType: PDF_DOWNLOAD_EVENT_TYPE,
      callback: () => document.getElementById(RAILPLUS_EXPORTBTN_ID).click(),
    },
  ],
  exportConfig: {
    getTemplateValues: () => ({
      publishedAt: "12/2023",
      year: "2023",
    }),
    getOverlayImageUrl: (lang) => {
      switch (lang) {
        case "fr":
          return railplusLegendFr;
        case "it":
          return railplusLegendIt;
        default:
          return railplusLegendDe;
      }
    },
    getExportFileName: (lang, t) =>
      `RAILplus ${t("Streckennetz")} ${new Date().toISOString().slice(0, 10)}`,
  },
  minZoom: 7,
};

export const messwagen = {
  name: "ch.sbb.messwagen",
  key: "ch.sbb.messwagen",
  layers: messwagenLayers,
  elements: {
    ...defaultElements,
    overlay: false,
  },
  hideInLayerTree: ONLY_WHEN_NOT_LOGGED_IN,
  mapControls: <MesswagenFollowButton />,
  customElements: <MesswagenPopup />,
};

const topics = {
  wkp: [
    netzkarte,
    geltungsbereicheMvp,
    direktverbindungen,
    direktverbindungenIframe,
    zweitausbildung,
    bauprojekte,
    handicap,
    tarifverbundkarte,
    infrastruktur,
    isb,
    regionenkartePublic,
    netzentwicklung,
    beleuchtungsstaerken,
    geltungsbereicheIframe,
    sts,
    energiePublic,
    sandbox,
    railPlus,
    messwagen,
  ],
  stelen: [netzkarteStelen],
  betriebsregionen: [betriebsregionen],
};

topics.wkp.forEach((topic) => {
  applPermalinkVisiblity(
    topic.layers,
    (pathname) => pathname?.indexOf(`/${topic.key}`) !== -1,
  );
});

export const getTopicConfig = (name) => {
  return topics[name];
};

export default topics;
