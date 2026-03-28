import { ERROR_TYPE } from '#shared/types/common';

export const defaultCriticalErrorProps = {
  type: ERROR_TYPE.CRITICAL,
  isSystemError: true,
  componentProps: {
    hasRefreshBtn: true,
  },
};
