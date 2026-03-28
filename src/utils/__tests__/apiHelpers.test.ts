import {
  vi, describe, it, expect,
} from 'vitest';
import type { AjaxError } from 'rxjs/ajax';
import * as rxjs from 'rxjs/operators';
import { type Observable, of } from 'rxjs';
import type { AnyAction } from 'redux';
import { defaultCriticalErrorProps } from '#shared/constants/errorProps';
import { ERROR_TYPE } from '#shared/types/common';
import i18next from 'i18next';

import {
  isValidationError, getCriticalErrorProps, buildURLQuery, catchError,
} from '../apiHelpers';

vi.mock('rxjs/operators', async (importOriginal) => {
  const original: typeof rxjs = await importOriginal();
  return {
    ...original,
    catchError: vi.fn(),
  };
});

i18next.init();
const i18n = i18next;

const catchErrorMock = vi.mocked(rxjs.catchError);

describe('apiHelpers', () => {
  describe('isValidationError', () => {
    it('should return false', () => {
      const serverResponse = {
        status: 500,
      } as AjaxError;
      expect(isValidationError(serverResponse)).toEqual(false);
    });
    it('should return true', () => {
      const serverResponse = {
        status: 422,
      } as AjaxError;
      expect(isValidationError(serverResponse)).toEqual(true);
    });
  });

  describe('getCriticalErrorProps', () => {
    it('should return default critical error props', () => {
      const serverResponse = {
        status: 400,
      } as AjaxError;
      expect(getCriticalErrorProps({ serverResponse, i18n })).toEqual(
        defaultCriticalErrorProps,
      );
    });

    it('should return error props with server message', () => {
      const serverResponse = {
        status: 400,
        response: {
          messageKey: 'Error message',
        },
      } as AjaxError;
      expect(getCriticalErrorProps({ serverResponse, i18n })).toEqual({
        type: ERROR_TYPE.CRITICAL,
        traceId: undefined,
        isSystemError: true,
        componentProps: {
          title: '400',
          description: 'Error message',
          backLink: undefined,
          backLinkTitle: undefined,
          hasRefreshBtn: true,
        },
      });
    });
    it('should return error props with server message with params', () => {
      const serverResponse = {
        status: 400,
        response: {
          messageKey: 'Error message {{number}}',
          messageParameters: { number: 42 },
        },
      } as AjaxError;
      expect(getCriticalErrorProps({ serverResponse, i18n })).toEqual({
        type: ERROR_TYPE.CRITICAL,
        traceId: undefined,
        isSystemError: true,
        componentProps: {
          title: '400',
          description: 'Error message 42',
          backLink: undefined,
          backLinkTitle: undefined,
          hasRefreshBtn: true,
        },
      });
    });
    it('should return error props with link and title', () => {
      const serverResponse = {
        status: 400,
        response: {
          messageKey: 'Error message',
        },
      } as AjaxError;
      expect(
        getCriticalErrorProps({ serverResponse, options: { link: 'link', title: 'title' }, i18n }),
      ).toEqual({
        type: ERROR_TYPE.CRITICAL,
        isSystemError: true,
        traceId: undefined,
        componentProps: {
          title: '400',
          description: 'Error message',
          backLink: 'link',
          backLinkTitle: 'title',
          hasRefreshBtn: true,
        },
      });
    });
    it('should return error props with title 404', () => {
      const serverResponse = {
        status: 404,
        response: {
          messageKey: 'Error message',
        },
      } as AjaxError;
      expect(getCriticalErrorProps({ serverResponse, i18n })).toEqual({
        type: ERROR_TYPE.CRITICAL,
        isSystemError: true,
        traceId: undefined,
        componentProps: {
          title: '404',
          description: 'Error message',
          backLink: undefined,
          backLinkTitle: undefined,
          hasRefreshBtn: false,
        },
      });
    });
    it('should return error props with empty title', () => {
      const serverResponse = {
        status: 0,
        response: {
          messageKey: 'Error message',
        },
      } as AjaxError;
      expect(getCriticalErrorProps({ serverResponse, i18n })).toEqual({
        type: ERROR_TYPE.CRITICAL,
        traceId: undefined,
        isSystemError: true,
        componentProps: {
          title: '',
          description: 'Error message',
          backLink: undefined,
          backLinkTitle: undefined,
          hasRefreshBtn: true,
        },
      });
    });
  });

  describe('buildURLQuery', () => {
    it('should return query string', () => {
      expect(buildURLQuery({ page: 0, rowsPerPage: 10 })).toEqual('page=0&rowsPerPage=10');
    });
  });

  describe('catchError', () => {
    it('should replace payload', () => {
      const expectedPayload = { httpStatus: 429, type: ERROR_TYPE.CRITICAL };
      const mockedResponse = { status: 429 };
      catchErrorMock.mockImplementation((cb) => cb(mockedResponse));

      const action$ = of({ type: 'error', payload: {} });
      const output$ = catchError(() => action$);

      (output$ as unknown as Observable<AnyAction>).subscribe(
        ({ payload }) => {
          expect(payload).toEqual(expectedPayload);
        },
      );
    });

    it('should not replace payload', () => {
      const expectedPayload = {};
      const mockedResponse = {};
      catchErrorMock.mockImplementation((cb) => cb(mockedResponse));

      const action$ = of({ type: 'error', payload: {} });
      const output$ = catchError(() => action$);

      (output$ as unknown as Observable<AnyAction>).subscribe(
        ({ payload }) => {
          expect(payload).toEqual(expectedPayload);
        },
      );
    });
  });
});
