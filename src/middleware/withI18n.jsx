/* eslint-disable react/jsx-props-no-spreading */
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const wrapI18next = (Component) => function i18nextHOC(props) {
  return (
    <I18nextProvider i18n={i18n}>
      <Component {...props} />
    </I18nextProvider>
  );
};

export default wrapI18next;
