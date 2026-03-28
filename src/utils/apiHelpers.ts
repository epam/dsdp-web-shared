// TODO: duplicate of equal file from citizen and officer portals
import type { Observable } from 'rxjs';
import type { AjaxError, AjaxResponse } from 'rxjs/ajax';
import { catchError as rxCatchError, map } from 'rxjs/operators';
import type { AnyAction } from 'redux';
import get from 'lodash/get';
import type { i18n as I18n } from 'i18next';
import {
  type ErrorResponse,
  type ServerValidationError,
  type ErrorInfo,
  ERROR_TYPE,
} from '#shared/types/common';
import { defaultCriticalErrorProps } from '#shared/constants/errorProps';

export const isValidationError = (serverResponse: AjaxError) => serverResponse.status === 422;
export const isConflictError = (serverResponse: AjaxError) => serverResponse.status === 409;
export const isPermissionError = (serverResponse: AjaxError) => serverResponse.status === 403;

export const getServerValidationErrors = (serverResponse: AjaxError) => {
  const errorBody = serverResponse.response as ErrorResponse;

  return get(errorBody, 'details.errors', []) as Array<ServerValidationError>;
};

const getErrorProps = ({
  title,
  hasRefreshBtn,
  description,
  backLink,
  backLinkTitle,
  isSystemError,
  traceId,
}:{
  title: string,
  hasRefreshBtn: boolean,
  description?: string,
  backLink?: string,
  backLinkTitle?:string,
  isSystemError?: boolean,
  traceId?: string;
}): ErrorInfo => ({
  type: ERROR_TYPE.CRITICAL,
  isSystemError,
  traceId,
  componentProps: {
    title,
    description,
    backLink,
    backLinkTitle,
    hasRefreshBtn,
  },
});

export const getCriticalErrorProps = ({
  serverResponse,
  errorProps,
  options,
  i18n,
} : {
  serverResponse: AjaxError,
  i18n: I18n
  options?: { link: string, title: string },
  errorProps?: ErrorInfo,
}): ErrorInfo => {
  const statusNotFound = 404;
  const { status, response: res } = serverResponse;
  const response = res as ErrorResponse;
  const nsSeparator = i18n.options.nsSeparator || ':';
  const message = response?.messageKey
  && i18n.t(`serverMessages${nsSeparator}${response.messageKey}`, response.messageParameters);
  const traceId = response?.traceId;
  const responseStatus = message && status ? status.toString() : '';

  const isStatusNotFound = status !== statusNotFound;

  if (errorProps) {
    return { traceId, ...errorProps };
  }

  if (status === 401) {
    return {
      type: ERROR_TYPE.AUTH,
      isSystemError: false,
      traceId,
      componentProps: {},
    };
  }

  if (options) {
    const { link, title } = options;
    return getErrorProps({
      traceId,
      title: responseStatus,
      hasRefreshBtn: isStatusNotFound,
      description: message,
      backLink: link,
      backLinkTitle: title,
      isSystemError: true,
    });
  }

  if (message) {
    return getErrorProps({
      traceId,
      title: responseStatus,
      hasRefreshBtn: isStatusNotFound,
      description: message,
      isSystemError: true,
    });
  }

  return { traceId, ...defaultCriticalErrorProps };
};

export const getComponentErrorProps = ({
  serverResponse,
  errorProps,
  options,
  i18n,
} : {
  serverResponse: AjaxError,
  i18n: I18n,
  options?: { link: string, title: string },
  errorProps?: ErrorInfo,
}): ErrorInfo => ({
  ...getCriticalErrorProps({
    serverResponse,
    errorProps,
    options,
    i18n,
  }),
  type: ERROR_TYPE.COMPONENT,
});

export const buildURLQuery = (data: Record<string, number | string>) => {
  return Object.entries(data)
    .map((pair) => pair.map(encodeURIComponent).join('='))
    .join('&');
};

export const catchError = (callBack: (error: AjaxError) => Observable<AnyAction>) => {
  const statusRateLimit = 429;

  const action = (error: AjaxError) => {
    if (error.status === statusRateLimit) {
      const payload = {
        type: ERROR_TYPE.CRITICAL,
        httpStatus: statusRateLimit,
      };

      return callBack(error)
        .pipe(
          map(({ type }: AnyAction) => {
            return { type, payload };
          }),
        );
    }
    return callBack(error);
  };

  return rxCatchError<AnyAction, Observable<AnyAction>>(action);
};

export const getNotificationErrorProps = (response: AjaxResponse, errorProps?: ErrorInfo): ErrorInfo => {
  const traceId = get(response, 'traceId', undefined);

  if (errorProps) {
    return { traceId, ...errorProps };
  }

  return { traceId, type: ERROR_TYPE.NOTIFICATION };
};
