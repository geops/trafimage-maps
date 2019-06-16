import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';

i18n
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init(
    {
      detection: {
        order: ['querystring'],
        lookupQuerystring: 'lang',
      },
      backend: {
        loadPath: `/lang/locale-{{lng}}-main.json`,
        // crossDomain: true,
      },
      fallbackLng: 'de',
      interpolation: {
        escapeValue: false,
      },
      keySeparator: ' µ', // Deactivate the keySeparator option
      saveMissing: false,
      missingKeyHandler(lng, ns, key, fallbackValue) {
        // eslint-disable-next-line no-console
        console.log(`Missing translations: ${key}`);
        return fallbackValue;
      },
      react: {
        useSuspense: false,
        wait: false,
      },
    },
    err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error('i18n initialisation failed:', err);
      }
    },
  );

export default i18n;
