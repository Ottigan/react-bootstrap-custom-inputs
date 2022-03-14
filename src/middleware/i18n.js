import i18next from 'i18next';
import en from './locales/en.json';
import lv from './locales/lv.json';

const i18n = i18next.createInstance();

i18n.init({
  resources: { en, lv },
  lng: 'en',
  fallbackLng: 'en',
  ns: ['reactBootstrapCustomInputs'],
  defaultNS: 'reactBootstrapCustomInputs',
  react: { useSuspense: false },
});

export default i18n;
