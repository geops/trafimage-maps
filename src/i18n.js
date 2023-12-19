import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-xhr-backend";

import translationDE from "./lang/de.json";
import translationEN from "./lang/en.json";
import translationFR from "./lang/fr.json";
import translationIT from "./lang/it.json";

const resources = {
  de: {
    translation: translationDE,
  },
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
  it: {
    translation: translationIT,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      detection: {
        order: ["querystring"],
        lookupQuerystring: "lang",
      },
      resources,
      fallbackLng: "de",
      interpolation: {
        escapeValue: false,
      },
      keySeparator: " µ", // Deactivate the keySeparator option
      nsSeparator: false, // Deactivate the nsSeparator option
      saveMissing: false,
      missingKeyHandler(lng, ns, key, fallbackValue) {
        // eslint-disable-next-line no-console
        console.log(`Missing translations: ${key}`);
        return fallbackValue;
      },
      react: {
        useSuspense: false,
        transKeepBasicHtmlNodesFor: [
          "br",
          "strong",
          "i",
          "div",
          "span",
          "img",
          "p",
          "a",
          "b",
        ],
      },
    },
    (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error("i18n initialisation failed:", err);
      }
    },
  );

export default i18n;
