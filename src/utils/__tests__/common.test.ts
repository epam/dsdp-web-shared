import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import type { i18n as I18n } from 'i18next';
import Cookies from 'js-cookie';
import {
  loadScript,
  loadLanguage,
  getAppLanguage,
  getEvalContext,
} from '../common';

vi.mock('js-cookie');
vi.mock('rxjs/ajax');

describe('common utilities', () => {
  describe('loadScript', () => {
    it('should load a script successfully', async () => {
      const url = 'https://example.com/script.js';
      document.head.append = vi.fn().mockImplementation((script) => {
        script.onload();
      });

      await expect(loadScript(url)).resolves.toBeUndefined();
      expect(document.head.append).toHaveBeenCalledWith(expect.objectContaining({ src: url }));
    });

    it('should fail to load a script', async () => {
      const url = 'https://example.com/script.js';
      document.head.append = vi.fn().mockImplementation((script) => {
        script.onerror();
      });

      await expect(loadScript(url)).rejects.toBeUndefined();
      expect(document.head.append).toHaveBeenCalledWith(expect.objectContaining({ src: url }));
    });
  });

  describe('loadLanguage', () => {
    const i18nMock = {
      addResourceBundle: vi.fn(),
    } as unknown as I18n;

    const apiMock = {
      get$: vi.fn(),
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should load language resources successfully', async () => {
      const langCode = 'en';
      const localeUrlPrefix = 'https://example.com';
      const mainResponse = { response: { ns1: { key: 'value' } } };
      const regulationResponse = { response: { key: 'value' } };

      apiMock.get$.mockReturnValueOnce({
        toPromise: () => Promise.resolve(mainResponse),
      });
      apiMock.get$.mockReturnValueOnce({
        toPromise: () => Promise.resolve(regulationResponse),
      });

      await loadLanguage(langCode, localeUrlPrefix, i18nMock, apiMock);

      expect(i18nMock.addResourceBundle).toHaveBeenCalledWith(langCode, 'ns1', { key: 'value' });
      expect(i18nMock.addResourceBundle).toHaveBeenCalledWith(langCode, 'regulation', { key: 'value' });
    });

    it('should handle failed language resource loading', async () => {
      const langCode = 'en';
      const localeUrlPrefix = 'https://example.com';

      apiMock.get$.mockReturnValueOnce({
        toPromise: () => Promise.reject(new Error('Failed to load')),
      });
      apiMock.get$.mockReturnValueOnce({
        toPromise: () => Promise.reject(new Error('Failed to load')),
      });

      await loadLanguage(langCode, localeUrlPrefix, i18nMock, apiMock);

      expect(i18nMock.addResourceBundle).not.toHaveBeenCalled();
    });
  });

  describe('getAppLanguage', () => {
    it('should return the language from the cookie if it is supported', () => {
      const cookieLanguage = 'fr';
      const envSupportedLanguages = ['en', 'fr', 'de'];
      (Cookies.get as vi.Mock).mockReturnValue(cookieLanguage);

      const result = getAppLanguage(undefined, envSupportedLanguages);
      expect(result).toBe(cookieLanguage);
    });

    it('should return the default language if cookie language is not supported', () => {
      const envLanguage = 'en';
      const envSupportedLanguages = ['en', 'fr', 'de'];
      (Cookies.get as vi.Mock).mockReturnValue('es');

      const result = getAppLanguage(envLanguage, envSupportedLanguages);
      expect(result).toBe(envLanguage);
    });

    it('should return the default language if no cookie language is set', () => {
      const envLanguage = 'en';
      const envSupportedLanguages = ['en', 'fr', 'de'];
      (Cookies.get as vi.Mock).mockReturnValue(undefined);

      const result = getAppLanguage(envLanguage, envSupportedLanguages);
      expect(result).toBe(envLanguage);
    });
  });

  describe('getEvalContext', () => {
    it('should return evaluation context with additional properties', () => {
      const language = 'en';
      const supportedLanguages = ['en', 'fr'];
      const additional = { customProp: 'customValue' };

      const result = getEvalContext(language, supportedLanguages, additional);

      expect(result).toEqual({
        getUserLanguage: expect.any(Function),
        getRegistryLanguage: expect.any(Function),
        getRegistrySupportedLanguages: expect.any(Function),
        customProp: 'customValue',
      });

      expect(result.getUserLanguage()).toBe(language);
      expect(result.getRegistryLanguage()).toBe(language);
      expect(result.getRegistrySupportedLanguages()).toBe(supportedLanguages);
    });
  });
});
