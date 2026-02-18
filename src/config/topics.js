import React from "react";
import "./proj4";
import tarifverbundkarteLegend from "../img/tarifverbund_legend.url.svg";
import railplusLegend from "../img/railplus_legend.svg";
import energieLegendPub from "../img/energie_legend_pub.url.svg";
import { getRailplusLayers } from "./ch.railplus.mitglieder";
import { getNetzkarteLayers } from "./ch.sbb.netzkarte";
// import constructionLayers from "./ch.sbb.construction";
import { getHandicapLayers } from "./ch.sbb.handicap";
import { getInfrastrukturLayers } from "./ch.sbb.infrastruktur";
import { getEnergieLayers } from "./ch.sbb.energie";
import { getTarifverbundkarteLayers } from "./ch.sbb.tarifverbundkarte.public";
import { getRegionenkartePublicLayers } from "./ch.sbb.regionenkarte.public";
import { getBeleuchtungsLayers } from "./ch.sbb.beleuchtungsstaerken";
import { getIsbLayers } from "./ch.sbb.isb";
import { getSandboxLayers } from "./ch.sbb.netzkarte.sandbox";
import { getZweitausbildungLayers } from "./ch.sbb.zweitausbildung";
import {
  getGeltungsbereicheLayers,
  TK_LAYER_KEY,
  HTA_LAYER_KEY,
  GA_LAYER_KEY,
} from "./ch.sbb.geltungsbereiche.mvp";
import { getGeltungsbereicheIframeLayers } from "./ch.sbb.geltungsbereiche.iframe";
import { getStsLayers } from "./ch.sbb.sts";
import { getDirektverbindungenLayers } from "./ch.sbb.direktverbindungen";
import { getDefaultSearches, getSearchByName, SearchName } from "./searches";
import GeltungsbereicheTopicMenu from "../menus/GeltungsbereicheTopicMenu";
import StsMenu from "../menus/StsMenu";
import {
  DV_KEY,
  INFRASTRUKTUR_LAYER_NAME,
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
import { getFunkmesswagenLayers } from "./ch.sbb.funkmesswagen";
import MesswagenFollowButton from "./ch.sbb.funkmesswagen/MesswagenFollowButton";
import { MesswagenPopup } from "../popups";
import StsMenuToggler from "./ch.sbb.sts/StsMenuToggler/StsMenuToggler";
import MapboxStyleLayer from "../layers/MapboxStyleLayer";
import { getDirektverbindungenSingleLayers } from "./ch.sbb.direktverbindungen.single";
// // For backward compatibility
// export {
//   casaDataLayerWithoutLabels,
//   casaNetzkarteLayerWithLabels,
//   casaNetzkarteLayerWithoutLabels,
// } from "./ch.sbb.casa";

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

export const getTopics = () => {
  const defaultSearches = getDefaultSearches();
  const handicapStopFinder = getSearchByName(SearchName.HandicapStopFinder);
  const stopFinder = getSearchByName(SearchName.Stationen);

  const netzkarte = {
    name: "ch.sbb.netzkarte.topic",
    key: "ch.sbb.netzkarte",
    elements: {
      ...defaultElements,
      popup: true,
      shareMenu: true,
      trackerMenu: true,
      floorSwitcher: true,
    },
    layers: getNetzkarteLayers(),
    projection: "EPSG:3857",
    layerInfoComponent: "NetzkarteTopicInfo",
    searches: defaultSearches,
  };

  const handicap = {
    name: "ch.sbb.handicap",
    key: "ch.sbb.handicap",
    elements: {
      ...defaultElements,
      shareMenu: true,
      popup: true,
    },
    layers: getHandicapLayers(),
    projection: "EPSG:3857",
    layerInfoComponent: "HandicapTopicInfo",
    searches: {
      Stationen: handicapStopFinder,
    },
    minZoom: 7,
  };

  const netzkarteStelen = {
    name: "ch.sbb.netzkarte.topic",
    key: "ch.sbb.netzkarte",
    // layers: [dataLayer, netzkarteLayer, stationsLayer, bahnhofplaene],
    elements: {},
    projection: "EPSG:3857",
  };

  // const bauprojekte = {
  //   name: "ch.sbb.construction",
  //   key: "ch.sbb.construction",
  //   elements: {
  //     ...defaultElements,
  //     shareMenu: true,
  //     popup: true,
  //     filter: true,
  //     filters: true,
  //   },
  //   layers: constructionLayers,
  //   projection: "EPSG:3857",
  //   layerInfoComponent: "ConstructionTopicInfo",
  //   searches: defaultSearches,
  //   minZoom: 7,
  // };

  const infrastruktur = {
    name: "ch.sbb.infrastruktur",
    key: "ch.sbb.infrastruktur",
    maxZoom: 14,
    elements: {
      ...defaultElements,
      shareMenu: true,
      popup: true,
    },
    layers: getInfrastrukturLayers(),
    projection: "EPSG:3857",
    layerInfoComponent: "InfrastrukturTopicInfo",
    searches: defaultSearches,
  };

  const netzkarteEisenbahninfrastruktur = infrastruktur.layers.find(
    (l) => l.name === INFRASTRUKTUR_LAYER_NAME,
  );
  // Clone layer to set visibility true by default for appName="betriebsregionen" [TRAFDIV-421]
  const betriebsRegionenVisible = new MapboxStyleLayer({
    name: "ch.sbb.betriebsregionen",
    visible: true,
    mapboxLayer: netzkarteEisenbahninfrastruktur,
    styleLayersFilter: ({ metadata }) =>
      /^operational_regions$/.test(metadata?.["general.filter"]),
    properties: {
      isQueryable: true,
      hasInfos: true,
      useOverlay: true,
      popupComponent: "BetriebsRegionenPopup",
      layerInfoComponent: "BetriebsRegionenLayerInfo",
    },
  });

  const betriebsregionen = {
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

  const regionenkartePublic = {
    name: "ch.sbb.regionenkarte.public",
    key: "ch.sbb.regionenkarte.public",
    maxZoom: 14,
    elements: {
      ...defaultElements,
      popup: true,
      overlay: true,
    },
    layers: getRegionenkartePublicLayers(),
    layerInfoComponent: "RegionenkartePublicTopicInfo",
    searches: defaultSearches,
    minZoom: 7,
  };

  const tarifverbundkarte = {
    name: "ch.sbb.tarifverbundkarte.public",
    key: "ch.sbb.tarifverbundkarte.public",
    layerInfoComponent: "TarifverbundkarteTopicInfo",
    layers: getTarifverbundkarteLayers(),
    maxZoom: 12,
    minZoom: 7,
    exportConfig: {
      getTemplateValues: () => ({
        publisher: "tobias.hauser@sbb.ch",
        publishedAt: "12/2025",
        dateDe: "14.12.2025",
        dateFr: "14.12.2025",
        year: "2025",
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

  const zweitausbildung = {
    name: "ch.sbb.zweitausbildung",
    key: "ch.sbb.zweitausbildung",
    maxZoom: 13,
    elements: { ...defaultElements, shareMenu: true, popup: true },
    layers: getZweitausbildungLayers(),
    projection: "EPSG:3857",
    layerInfoComponent: "ZweitausbildungTopicInfo",
    searches: defaultSearches,
    minZoom: 7,
  };

  const beleuchtungsstaerken = {
    name: "ch.sbb.beleuchtungsstaerken",
    key: "ch.sbb.beleuchtungsstaerken",
    maxZoom: 14,
    elements: { ...defaultElements, shareMenu: true, popup: true },
    layers: getBeleuchtungsLayers(),
    projection: "EPSG:3857",
    layerInfoComponent: "BeleuchtungTopicInfo",
    searches: defaultSearches,
    minZoom: 7,
  };

  const energiePublic = {
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
    layers: getEnergieLayers(),
    projection: "EPSG:3857",
    layerInfoComponent: "EnergiePublicTopicInfo",
    searches: defaultSearches,
    minZoom: 7,
  };

  const isb = {
    name: "ch.sbb.isb",
    key: "ch.sbb.isb",
    maxZoom: 14,
    elements: {
      ...defaultElements,
      shareMenu: true,
      popup: true,
    },
    layers: getIsbLayers(),
    projection: "EPSG:3857",
    layerInfoComponent: "IsbTopicInfo",
    searches: defaultSearches,
    minZoom: 7,
  };

  const sandbox = {
    name: "ch.sbb.netzkarte.sandbox",
    key: "ch.sbb.netzkarte.sandbox",
    layers: getSandboxLayers(),
    projection: "EPSG:3857",
    elements: defaultElements,
    layerInfoComponent: "SandboxTopicInfo",
    searches: defaultSearches,
  };

  const geltunsbereicheLayers = getGeltungsbereicheLayers();
  const geltungsbereicheTk = geltunsbereicheLayers.find(
    (l) => l.name === TK_LAYER_KEY,
  );
  const geltungsbereicheHta = geltunsbereicheLayers.find(
    (l) => l.name === HTA_LAYER_KEY,
  );
  const geltungsbereicheGA = geltunsbereicheLayers.find(
    (l) => l.name === GA_LAYER_KEY,
  );
  const getVisibleGbExportLayer = () =>
    [geltungsbereicheTk, geltungsbereicheHta, geltungsbereicheGA].find(
      (l) => l.visible,
    );

  const geltungsbereicheMvp = {
    name: "ch.sbb.geltungsbereiche",
    key: "ch.sbb.geltungsbereiche",
    elements: {
      ...defaultElements,
      popup: true,
      shareMenu: true,
    },
    maxZoom: 14,
    minZoom: 7,
    layers: geltunsbereicheLayers,
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

  const geltungsbereicheIframe = {
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
    layers: getGeltungsbereicheIframeLayers(),
    only: true,
    hideInLayerTree: true,
    menu: <GeltungsbereicheTopicMenu />,
  };

  const sts = {
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
    layers: getStsLayers(),
    only: true,
    hideInLayerTree: true,
    menu: <StsMenu />,
    enableFeatureClick: true,
    disablePermalinkLayers: false,
    center: [915788.3813658276, 5909670.533831286],
    zoom: 8,
    constrainOnlyCenter: true,
    overlaySide: "left",
    searches: {
      Stationen: stopFinder,
    },
    menuToggler: <StsMenuToggler />,
  };

  const direktverbindungen = {
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
    layers: getDirektverbindungenLayers(),
    projection: "EPSG:3857",
    layerInfoComponent: "DvTopicInfo",
    searches: defaultSearches,
    mapControls: <DvListButton />,
  };

  const direktverbindungenIframe = {
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
    layers: getDirektverbindungenLayers(),
    enableFeatureClick: true,
    only: true,
    hideInLayerTree: true,
    menu: <DvMenu />,
    mapControls: <DvListButton />,
    overlaySide: "left",
  };

  const direktverbindungenSingle = {
    name: `${DV_KEY}-single.topic`,
    key: `${DV_KEY}-single`,
    elements: {
      ...defaultElements,
      overlay: false,
      popup: false,
      shareMenu: false,
      drawMenu: false,
      permalink: false,
      geolocationButton: false,
      header: false,
      search: false,
      footer: false,
      menu: false,
      baseLayerSwitcher: false,
      fitExtent: false,
    },
    maxZoom: 13,
    minZoom: 6,
    layers: getDirektverbindungenSingleLayers(),
    enableFeatureClick: false,
    only: true,
    hideInLayerTree: true,
    // menu: <DvMenu />,
    // mapControls: <DvListButton />,
    // overlaySide: "left",
  };

  const railPlus = {
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
    layers: getRailplusLayers(),
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
        publishedAt: "12/2025",
        year: "2025",
      }),
      getOverlayImageUrl: () => railplusLegend,
      getExportFileName: () =>
        `RAILplus Streckennetz-Carte du réseau-Carta della rete  ${new Date().toISOString().slice(0, 10)}`,
    },
    minZoom: 7,
    maxZoom: 13,
    noTracking: true,
  };

  const messwagen = {
    name: "ch.sbb.funkmesswagen",
    key: "ch.sbb.funkmesswagen",
    layers: getFunkmesswagenLayers(),
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

  return {
    wkp: [
      netzkarte,
      geltungsbereicheMvp,
      direktverbindungen,
      direktverbindungenIframe,
      direktverbindungenSingle,
      zweitausbildung,
      handicap,
      tarifverbundkarte,
      infrastruktur,
      isb,
      regionenkartePublic,
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
};

export const getTopicsFromAppName = (name) => {
  const topics = getTopics();

  topics.wkp.forEach((topic) => {
    applyPermalinkVisiblity(
      topic.layers,
      (pathname) => pathname?.indexOf(`/${topic.key}`) !== -1,
    );
  });

  return topics[name];
};
