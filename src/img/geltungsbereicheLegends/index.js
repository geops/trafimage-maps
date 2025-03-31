/* eslint-disable import/no-duplicates */
import gaLegendA3De from "./ga_legend_a3_de.svg";
import gaLegendA3Fr from "./ga_legend_a3_fr.svg";
import gaLegendA3It from "./ga_legend_a3_it.svg";
import gaLegendA3En from "./ga_legend_a3_en.svg";
import gaLegendA4De from "./ga_legend_a4_de.svg";
import gaLegendA4Fr from "./ga_legend_a4_fr.svg";
import gaLegendA4It from "./ga_legend_a4_it.svg";
import gaLegendA4En from "./ga_legend_a4_en.svg";

import halbtaxLegendA3De from "./hta_legend_a3_de.svg";
import halbtaxLegendA3Fr from "./hta_legend_a3_fr.svg";
import halbtaxLegendA3It from "./hta_legend_a3_it.svg";
import halbtaxLegendA3En from "./hta_legend_a3_en.svg";
import halbtaxLegendA4De from "./hta_legend_a4_de.svg";
import halbtaxLegendA4Fr from "./hta_legend_a4_fr.svg";
import halbtaxLegendA4It from "./hta_legend_a4_it.svg";
import halbtaxLegendA4En from "./hta_legend_a4_en.svg";

import sparAktionTagLegendA3De from "./tk_legend_a3_de.svg";
import sparAktionTagLegendA3Fr from "./tk_legend_a3_fr.svg";
import sparAktionTagLegendA3It from "./tk_legend_a3_it.svg";
import sparAktionTagLegendA3En from "./tk_legend_a3_en.svg";
import sparAktionTagLegendA4De from "./tk_legend_a4_de.svg";
import sparAktionTagLegendA4Fr from "./tk_legend_a4_fr.svg";
import sparAktionTagLegendA4It from "./tk_legend_a4_it.svg";
import sparAktionTagLegendA4En from "./tk_legend_a4_en.svg";

import {
  GA_LAYER_KEY,
  HTA_LAYER_KEY,
  TK_LAYER_KEY,
} from "../../config/ch.sbb.geltungsbereiche.mvp";

const createGetScalelinePosition =
  (fatcorX, factorY) => (pdfSize, quality) => ({
    x: pdfSize[0] * quality * fatcorX,
    y: pdfSize[1] * quality * factorY,
  });

const galegends = [
  {
    paperSize: "a3",
    language: "de",
    validity: GA_LAYER_KEY,
    legend: gaLegendA3De,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.27),
  },
  {
    paperSize: "a3",
    language: "fr",
    validity: GA_LAYER_KEY,
    legend: gaLegendA3Fr,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.305),
  },
  {
    paperSize: "a3",
    language: "it",
    validity: GA_LAYER_KEY,
    legend: gaLegendA3It,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.29),
  },
  {
    paperSize: "a3",
    language: "en",
    validity: GA_LAYER_KEY,
    legend: gaLegendA3En,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.275),
  },
  {
    paperSize: "a4",
    language: "de",
    validity: GA_LAYER_KEY,
    legend: gaLegendA4De,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.29),
  },
  {
    paperSize: "a4",
    language: "fr",
    validity: GA_LAYER_KEY,
    legend: gaLegendA4Fr,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.315),
  },
  {
    paperSize: "a4",
    language: "it",
    validity: GA_LAYER_KEY,
    legend: gaLegendA4It,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.315),
  },
  {
    paperSize: "a4",
    language: "en",
    validity: GA_LAYER_KEY,
    legend: gaLegendA4En,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.295),
  },
];

const halbtaxLegends = [
  {
    paperSize: "a3",
    language: "de",
    validity: HTA_LAYER_KEY,
    legend: halbtaxLegendA3De,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.205),
  },
  {
    paperSize: "a3",
    language: "fr",
    validity: HTA_LAYER_KEY,
    legend: halbtaxLegendA3Fr,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.21),
  },
  {
    paperSize: "a3",
    language: "it",
    validity: HTA_LAYER_KEY,
    legend: halbtaxLegendA3It,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.21),
  },
  {
    paperSize: "a3",
    language: "en",
    validity: HTA_LAYER_KEY,
    legend: halbtaxLegendA3En,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.2),
  },
  {
    paperSize: "a4",
    language: "de",
    validity: HTA_LAYER_KEY,
    legend: halbtaxLegendA4De,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.225),
  },
  {
    paperSize: "a4",
    language: "fr",
    validity: HTA_LAYER_KEY,
    legend: halbtaxLegendA4Fr,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.225),
  },
  {
    paperSize: "a4",
    language: "it",
    validity: HTA_LAYER_KEY,
    legend: halbtaxLegendA4It,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.22),
  },
  {
    paperSize: "a4",
    language: "en",
    validity: HTA_LAYER_KEY,
    legend: halbtaxLegendA4En,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.215),
  },
];

const sparAktionTagLegends = [
  {
    paperSize: "a3",
    language: "de",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA3De,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.23),
  },
  {
    paperSize: "a3",
    language: "fr",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA3Fr,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.235),
  },
  {
    paperSize: "a3",
    language: "it",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA3It,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.235),
  },
  {
    paperSize: "a3",
    language: "en",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA3En,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.23),
  },
  {
    paperSize: "a4",
    language: "de",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA4De,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.255),
  },
  {
    paperSize: "a4",
    language: "fr",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA4Fr,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.259),
  },
  {
    paperSize: "a4",
    language: "it",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA4It,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.255),
  },
  {
    paperSize: "a4",
    language: "en",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA4En,
    getScaleLinePosition: createGetScalelinePosition(0.021, 0.252),
  },
];

export default [...galegends, ...halbtaxLegends, ...sparAktionTagLegends];
