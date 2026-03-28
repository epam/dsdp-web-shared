import React from 'react';
import '@testing-library/jest-dom';

import { vi } from 'vitest';
import { configure } from '@testing-library/react';
import { OSDefaultLight } from '#web-components/styles';

configure({ testIdAttribute: 'data-xpath' });

vi.spyOn(global.console, 'warn').mockImplementation(() => vi.fn());
vi.spyOn(global.console, 'error').mockImplementation(() => vi.fn());

vi.mock('react-i18next', () => {
  const t = (key) => key;
  const i18n = {
    language: 'en',
    options: { nsSeparator: ':' },
    t,
    getResourceBundle: vi.fn(),
    getFixedT: vi.fn(),
  };
  return {
    useTranslation: () => ({ t, i18n }),
    initReactI18next: { init: vi.fn(), type: '3rdParty' },
    // eslint-disable-next-line react/display-name
    withTranslation: () => (Component) => function withTranslation(props) {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <Component {...props} t={t} i18n={i18n} />;
    },
  };
});

vi.mock('@material-ui/core/styles', async (importOriginal) => {
  const styles = await importOriginal('@material-ui/core/styles');

  return {
    ...styles,
    makeStyles: (func) => {
      const theme = styles.createMuiTheme({
        colors: OSDefaultLight.colors,
        borders: OSDefaultLight.borders,
        typography: OSDefaultLight.typography,
        shadow: OSDefaultLight.shadow,
        flags: OSDefaultLight.flags,
      });
      return styles.makeStyles(func.bind(null, theme));
    },
  };
});

global.ENVIRONMENT_VARIABLES = {
  apiUrl: '',
  signWidgetUrl: '',
  supportedLanguages: ['en', 'uk'],
};

global.REGISTRY_ENVIRONMENT_VARIABLES = {
  supportEmail: '',
};

global.REGISTRY_SETTINGS = {
  settings: {
    general: {
      title: '',
      titleFull: '',
    },
  },
};

global.APPLICATION_THEME = null;
