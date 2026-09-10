import I18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en";
import ro from "./ro";

// eslint-disable-next-line react-hooks/rules-of-hooks
I18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en,
    ro,
  },
});

export default I18n;
