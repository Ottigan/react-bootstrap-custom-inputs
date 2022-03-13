import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import lv from './locales/lv.json';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en,
      lv,
    },
    lng: 'en',
    fallbackLng: 'en',
    react: { useSuspense: false },
  });

i18next.services.formatter.add('capitalize', (v) => v[0].toUpperCase() + v.slice(1));

export default i18next;
