import {
  describe, it, expect,
  vi, beforeEach,
} from 'vitest';
import { REGULATION_NS } from '#shared/constants/common';
import type { i18n as I18n } from 'i18next';
import type { RegistrySettings } from 'types/common';
import { getRegistryTitle, getRegistryTitleFull } from '../registrySettings';

describe('registrySettings utils', () => {
  const mockI18n: I18n = {
    t: vi.fn(),
    options: {
      nsSeparator: ':',
    },
  } as any;

  const mockSettings: RegistrySettings = {
    settings: {
      general: {
        title: 'Test Title',
        titleFull: 'Test Full Title',
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRegistryTitle', () => {
    it('should return the translated title', () => {
      getRegistryTitle(mockSettings, mockI18n);
      expect(mockI18n.t).toHaveBeenCalledWith(`${REGULATION_NS}:Test Title`);
    });

    it('should return an empty string if title is not defined', () => {
      const settingsWithoutTitle = { settings: { general: {} } } as RegistrySettings;
      getRegistryTitle(settingsWithoutTitle, mockI18n);
      expect(mockI18n.t).toHaveBeenCalledWith(`${REGULATION_NS}:`);
    });
  });

  describe('getRegistryTitleFull', () => {
    it('should return the translated full title', () => {
      getRegistryTitleFull(mockSettings, mockI18n);
      expect(mockI18n.t).toHaveBeenCalledWith(`${REGULATION_NS}:Test Full Title`);
    });

    it('should return an empty string if full title is not defined', () => {
      const settingsWithoutFullTitle = { settings: { general: {} } } as RegistrySettings;
      getRegistryTitleFull(settingsWithoutFullTitle, mockI18n);
      expect(mockI18n.t).toHaveBeenCalledWith(`${REGULATION_NS}:`);
    });
  });
});
