import { REGULATION_NS } from '#shared/constants/common';
import type { i18n as I18n } from 'i18next';
import type { RegistrySettings } from 'types/common';

export const getRegistryTitle = (
  { settings }: RegistrySettings,
  i18n: I18n,
) => i18n.t(`${REGULATION_NS}${i18n.options.nsSeparator}${settings?.general?.title ?? ''}`);
export const getRegistryTitleFull = (
  { settings }: RegistrySettings,
  i18n: I18n,
) => i18n.t(`${REGULATION_NS}${i18n.options.nsSeparator}${settings?.general?.titleFull ?? ''}`);
