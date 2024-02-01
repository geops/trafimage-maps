/* eslint-disable import/no-duplicates */
import gaLegendA3De from "./ga_legend_a3_de.svg";
import gaLegendA3Fr from "./ga_legend_a3_de.svg";
import gaLegendA3It from "./ga_legend_a3_de.svg";
import gaLegendA3En from "./ga_legend_a3_de.svg";
import gaLegendA4De from "./ga_legend_a4_de.svg";
import gaLegendA4Fr from "./ga_legend_a4_de.svg";
import gaLegendA4It from "./ga_legend_a4_de.svg";
import gaLegendA4En from "./ga_legend_a4_de.svg";

import sparAktionTagLegendA3De from "./ga_legend_a3_de.svg";
import sparAktionTagLegendA3Fr from "./ga_legend_a3_de.svg";
import sparAktionTagLegendA3It from "./ga_legend_a3_de.svg";
import sparAktionTagLegendA3En from "./ga_legend_a3_de.svg";
import sparAktionTagLegendA4De from "./ga_legend_a4_de.svg";
import sparAktionTagLegendA4Fr from "./ga_legend_a4_de.svg";
import sparAktionTagLegendA4It from "./ga_legend_a4_de.svg";
import sparAktionTagLegendA4En from "./ga_legend_a4_de.svg";

import halbtaxLegendA3De from "./ga_legend_a3_de.svg";
import halbtaxLegendA3Fr from "./ga_legend_a3_de.svg";
import halbtaxLegendA3It from "./ga_legend_a3_de.svg";
import halbtaxLegendA3En from "./ga_legend_a3_de.svg";
import halbtaxLegendA4De from "./ga_legend_a4_de.svg";
import halbtaxLegendA4Fr from "./ga_legend_a4_de.svg";
import halbtaxLegendA4It from "./ga_legend_a4_de.svg";
import halbtaxLegendA4En from "./ga_legend_a4_de.svg";

import { GA_LAYER_KEY } from "../../config/ch.sbb.geltungsbereiche.mvp";
import { HALBTAX_LAYER_KEY } from "../../config/ch.sbb.geltungsbereiche.mvp";
import { TK_LAYER_KEY } from "../../config/ch.sbb.geltungsbereiche.mvp";

const galegends = [
  {
    format: "a3",
    language: "de",
    validity: GA_LAYER_KEY,
    legend: gaLegendA3De,
    getScaleLinePosition: (pdfSize, resolution) => {
      return {
        x: pdfSize[0] * resolution * 0.021,
        y: pdfSize[1] * resolution * 0.27,
      };
    },
  },
  {
    format: "a3",
    language: "fr",
    validity: GA_LAYER_KEY,
    legend: gaLegendA3Fr,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.021,
      y: pdfSize[1] * resolution * 0.27,
    }),
  },
  {
    format: "a3",
    language: "it",
    validity: GA_LAYER_KEY,
    legend: gaLegendA3It,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.021,
      y: pdfSize[1] * resolution * 0.27,
    }),
  },
  {
    format: "a3",
    language: "en",
    validity: GA_LAYER_KEY,
    legend: gaLegendA3En,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.021,
      y: pdfSize[1] * resolution * 0.27,
    }),
  },
  {
    format: "a4",
    language: "de",
    validity: GA_LAYER_KEY,
    legend: gaLegendA4De,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a4",
    language: "fr",
    validity: GA_LAYER_KEY,
    legend: gaLegendA4Fr,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a4",
    language: "it",
    validity: GA_LAYER_KEY,
    legend: gaLegendA4It,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a4",
    language: "en",
    validity: GA_LAYER_KEY,
    legend: gaLegendA4En,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
];

const sparAktionTagLegends = [
  {
    format: "a3",
    language: "de",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA3De,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a3",
    language: "fr",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA3Fr,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a3",
    language: "it",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA3It,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a3",
    language: "en",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA3En,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a4",
    language: "de",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA4De,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a4",
    language: "fr",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA4Fr,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a4",
    language: "it",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA4It,
  },
  {
    format: "a4",
    language: "en",
    validity: TK_LAYER_KEY,
    legend: sparAktionTagLegendA4En,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
];

const halbtaxLegends = [
  {
    format: "a3",
    language: "de",
    validity: HALBTAX_LAYER_KEY,
    legend: halbtaxLegendA3De,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a3",
    language: "fr",
    validity: HALBTAX_LAYER_KEY,
    legend: halbtaxLegendA3Fr,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a3",
    language: "it",
    validity: HALBTAX_LAYER_KEY,
    legend: halbtaxLegendA3It,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a3",
    language: "en",
    validity: HALBTAX_LAYER_KEY,
    legend: halbtaxLegendA3En,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a4",
    language: "de",
    validity: HALBTAX_LAYER_KEY,
    legend: halbtaxLegendA4De,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a4",
    language: "fr",
    validity: HALBTAX_LAYER_KEY,
    legend: halbtaxLegendA4Fr,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a4",
    language: "it",
    validity: HALBTAX_LAYER_KEY,
    legend: halbtaxLegendA4It,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
  {
    format: "a4",
    language: "en",
    validity: HALBTAX_LAYER_KEY,
    legend: halbtaxLegendA4En,
    getScaleLinePosition: (pdfSize, resolution) => ({
      x: pdfSize[0] * resolution * 0.026,
      y: pdfSize[1] * resolution * 0.28,
    }),
  },
];

export default [...galegends, ...sparAktionTagLegends, ...halbtaxLegends];
