import type { Status } from 'reapop';

export interface ErrorInfo {
  message?: string;
  type?: ERROR_TYPE;
  httpStatus?: number;
  notifyType?: Status;
  isSystemError?: boolean;
  traceId?: string;
  componentProps?: {
    title?: string;
    description?: string;
    backLink?: string;
    backLinkTitle?: string;
    hasRefreshBtn?: boolean;
    hideNavigation?: boolean;
  };
  details?: ServerValidationError
}

export interface ServerValidationError {
  message: string,
  messageKey?: string,
  messageParams?: Record<string, string>
  field: string,
  value: unknown,
}

export interface ErrorResponse {
  traceId: string,
  code: string,
  message: string,
  messageKey: string,
  messageParameters: Record<string, string>,
  details?: {
    validationErrors?: Array<ServerValidationError>,
  }
}

export enum ERROR_TYPE {
  AUTH = 'AUTH',
  CRITICAL = 'CRITICAL',
  NOTIFICATION = 'NOTIFICATION',
  VALIDATION = 'VALIDATION',
  COMPONENT = 'COMPONENT',
}

export type ListFilterOptions = {
  firstResult: number,
  maxResults: number,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
};

export type HistoryFilterOptions = {
  offset: number,
  limit: number,
  sort: string,
};

export type RegistrySettings = {
  settings: {
    general: {
      title: string,
      titleFull: string,
    },
  },
};

export type RouterStateParams = {
  apiStatus?: number;
  forceLeave?: boolean;
};
