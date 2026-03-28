import type { i18n as I18n } from 'i18next';
import { isObject } from 'lodash';
import type { ajax } from 'rxjs/ajax';
import Cookies from 'js-cookie';
import { COOKIE_LANGUAGE, DEFAULT_LANGUAGE } from '#shared/constants/common';
import type { FormFunctionsEvalContext } from 'types/form';
import type { NavigateOptions, To } from 'react-router';

export async function loadScript(url: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = resolve;
    script.onerror = reject;
    script.async = false;
    script.setAttribute('src', url);
    document.head.append(script);
  });
}

type Api = {
  get$: typeof ajax.get
};

export const loadLanguage = (langCode:string, localeUrlPrefix: string, i18n: I18n, api: Api) => Promise.allSettled([
  api.get$(`${localeUrlPrefix}/locales/${langCode}.json`).toPromise(),
  api.get$(`${localeUrlPrefix}/locales/regulation/${langCode}.json`).toPromise(),
])
  .then(([main, regulation]): void => {
    if (main.status === 'fulfilled' && main.value?.response) {
      const data = main.value?.response;
      Object.keys(data).forEach((ns) => {
        i18n.addResourceBundle(langCode, ns, data[ns]);
      });
    }
    if (regulation.status === 'fulfilled' && regulation.value?.response && isObject(regulation.value?.response)) {
      const data = regulation.value?.response;
      i18n.addResourceBundle(langCode, 'regulation', data);
    }
  });

export const getAppLanguage = (envLanguage?: string, envSupportedLanguages?: string[]) => {
  const cookieLanguage = Cookies.get(COOKIE_LANGUAGE);
  if (cookieLanguage && envSupportedLanguages?.includes(cookieLanguage)) {
    return cookieLanguage;
  }
  const language = envLanguage || DEFAULT_LANGUAGE;
  return language;
};

export const getResourceBundlesFromNamespaces = (i18n: I18n, namespaces: string[], languages: string[]) => {
  let result: Record<string, Record<string, string>> = {};
  languages.forEach((lang) => {
    namespaces.forEach((ns) => {
      result = {
        ...result,
        [lang]: {
          ...result[lang],
          ...i18n.getResourceBundle(lang, ns),
        },
      };
    });
  });
  return result;
};

export function getEvalContext<T>(
  language: string,
  supportedLanguages: string[],
  additional?: Record<string, unknown>,
): FormFunctionsEvalContext & T {
  return {
    getUserLanguage: () => getAppLanguage(language, supportedLanguages),
    getRegistryLanguage: () => language,
    getRegistrySupportedLanguages: () => supportedLanguages,
    ...additional,
  } as FormFunctionsEvalContext & T;
}

export const customNavigate = (to: To, options?: NavigateOptions) => {
  // Create a custom event that React Router's listeners will detect
  window.dispatchEvent(
    new CustomEvent('reactRouterNavigate', {
      detail: { to, options: options || {} },
    }),
  );
};

export const BROWSER_PUSH_ACTION_TYPE = 'BROWSER_HISTORY_ROUTER_PUSH';

export function customNavigateAction(to: To, options?: NavigateOptions) {
  customNavigate(to, options);
  return { type: BROWSER_PUSH_ACTION_TYPE, payload: { path: to, ...(options && { options }) } };
}
