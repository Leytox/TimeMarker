"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslations from "./locales/en.json";
import esTranslations from "./locales/es.json";
import frTranslations from "./locales/fr.json";
import ruTranslations from "./locales/ru.json";
import ukTranslations from "./locales/ua.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      es: {
        translation: esTranslations,
      },
      fr: {
        translation: frTranslations,
      },
      ru: {
        translation: ruTranslations,
      },
      ua: {
        translation: ukTranslations,
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;