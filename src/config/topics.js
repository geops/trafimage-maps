import React from "react";
import "./proj4";
import tarifverbundkarteLegend from "../img/tarifverbund_legend.url.svg";
import railplusLegend from "../img/railplus_legend.svg";
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
import geltungsbereicheMvpLayers, {
  geltungsbereicheTk,
  geltungsbereicheHta,
  geltungsbereicheGA,
} from "./ch.sbb.geltungsbereiche.mvp";
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
import applyPermalinkVisiblity from "../utils/applyPermalinkVisibility";
import RailplusMenu from "../menus/RailplusMenu";
import RailplusExportButton from "./ch.railplus.mitglieder/RailplusExportButton";
import GaExportMapButton from "../menus/GaExportMenu/GaExportMapButton";
import geltungsbereicheLegends from "../img/geltungsbereicheLegends";
import messwagenLayers from "./ch.sbb.funkmesswagen";
import MesswagenFollowButton from "./ch.sbb.funkmesswagen/MesswagenFollowButton";
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
  minZoom: 7,
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
  minZoom: 7,
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
  maxZoom: 14,
  elements: {
    ...defaultElements,
    popup: true,
    overlay: true,
  },
  layers: regionenkarteLayers,
  layerInfoComponent: "RegionenkartePublicTopicInfo",
  searches: defaultSearches,
  minZoom: 7,
};

export const tarifverbundkarte = {
  name: "ch.sbb.tarifverbundkarte.public",
  key: "ch.sbb.tarifverbundkarte.public",
  layerInfoComponent: "TarifverbundkarteTopicInfo",
  layers: tarifverbundkarteLayers,
  maxZoom: 12,
  minZoom: 7,
  exportConfig: {
    getTemplateValues: () => ({
      publisher: "tobias.hauser@sbb.ch",
      publishedAt: "12/2024",
      dateDe: "15.12.2024",
      dateFr: "15.12.2024",
      year: "2024",
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
  minZoom: 7,
};

export const netzentwicklung = {
  name: "ch.sbb.netzentwicklung",
  key: "ch.sbb.netzentwicklung",
  maxZoom: 14,
  elements: { ...defaultElements, shareMenu: true, popup: true, overlay: true },
  layers: netzentwicklungLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "NetzentwicklungTopicInfo",
  searches: defaultSearches,
  minZoom: 7,
};

export const beleuchtungsstaerken = {
  name: "ch.sbb.beleuchtungsstaerken",
  key: "ch.sbb.beleuchtungsstaerken",
  maxZoom: 14,
  elements: { ...defaultElements, shareMenu: true, popup: true },
  layers: beleuchtungLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "BeleuchtungTopicInfo",
  searches: defaultSearches,
  minZoom: 7,
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
  minZoom: 7,
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
  minZoom: 7,
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

const getVisibleGbExportLayer = () =>
  [geltungsbereicheTk, geltungsbereicheHta, geltungsbereicheGA].find(
    (l) => l.visible,
  );

export const geltungsbereicheMvp = {
  name: "ch.sbb.geltungsbereiche",
  key: "ch.sbb.geltungsbereiche",
  elements: {
    ...defaultElements,
    popup: true,
    shareMenu: true,
  },
  maxZoom: 14,
  minZoom: 7,
  layers: geltungsbereicheMvpLayers,
  projection: "EPSG:3857",
  layerInfoComponent: "GeltungsbereicheTopicInfo",
  searches: defaultSearches,
  mapControls: <GaExportMapButton />,
  exportConfig: {
    getTemplateValues: () => ({
      publishedAt: new Date().toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
      }),
    }),
    getOverlayImageUrl: (lang, paperSize) => {
      const visibleLayer = getVisibleGbExportLayer();
      return (
        geltungsbereicheLegends.find(
          (l) =>
            l.paperSize === paperSize &&
            l.language === lang &&
            l.validity === visibleLayer?.name,
        )?.legend || geltungsbereicheLegends[0].legend
      );
    },
    getExportFileName: (t, paperSize, lang) => {
      const nameByLang = t("ch.sbb.geltungsbereiche").replaceAll(" ", "_");
      const date = new Date().toISOString().slice(0, 10);
      return `${nameByLang}_${paperSize.toUpperCase()}_${lang.toUpperCase()}_${date}.pdf`;
    },
  },
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
    baseLayerSwitcher: false,
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
  name: "ch.railplus.mitglieder",
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
    getOverlayImageUrl: () => railplusLegend,
    getExportFileName: () =>
      `RAILplus Streckennetz-Carte du réseau-Carta della rete  ${new Date().toISOString().slice(0, 10)}`,
  },
  minZoom: 7,
  maxZoom: 13,
  noTracking: true,
};

export const messwagen = {
  name: "ch.sbb.funkmesswagen",
  key: "ch.sbb.funkmesswagen",
  layers: messwagenLayers,
  elements: {
    ...defaultElements,
    drawMenu: false,
  },
  hideInLayerTree: ONLY_WHEN_NOT_LOGGED_IN,
  mapControls: <MesswagenFollowButton />,
  searches: defaultSearches,
  layerInfoComponent: "MesswagenTopicInfo",
  customElements: <MesswagenPopup />,
};

const topics = {
  wkp: [
    netzkarte,
    geltungsbereicheMvp,
    direktverbindungen,
    direktverbindungenIframe,
    zweitausbildung,
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
  applyPermalinkVisiblity(
    topic.layers,
    (pathname) => pathname?.indexOf(`/${topic.key}`) !== -1,
  );
});

export const getTopicConfig = (name) => {
  return topics[name];
};

export default topics;
