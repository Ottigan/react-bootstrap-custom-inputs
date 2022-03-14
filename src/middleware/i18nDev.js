import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import devEn from './locales/devEn.json';
import devLv from './locales/devLv.json';

const i18nDev = i18next.createInstance();

export default i18nDev
  .use(initReactI18next)
  .init({
    resources: { en: devEn, lv: devLv },
    lng: 'en',
    ns: ['reactBootstrapCustomInputs'],
    defaultNS: 'reactBootstrapCustomInputs',
    react: { useSuspense: false },
  });
