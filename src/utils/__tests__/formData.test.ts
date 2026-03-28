import { describe, it, expect } from 'vitest';
import { formatFormSubmissionToTaskData, createErrorMessage, getValidationErrors } from 'utils/formData';
import { ERROR_TYPE } from '#shared/types/common';
import type { FormSubmission } from '#web-components/components/Form/types';

const i18n = {
  t: (str: string) => str,
  exists: () => true,
  options: {
    nsSeparator: ':',
  },
};

describe('FormData utils', () => {
  it('should correctly convert FormSubmission to TaskSubmissionPayload', () => {
    const submission = { data: { foo: 'bar', var1: 'var1value' } };
    const taskSubmissionPayload = {
      data: {
        foo: 'bar',
        var1: 'var1value',
      },
    };
    expect(formatFormSubmissionToTaskData(submission as unknown as FormSubmission))
      .toMatchObject(taskSubmissionPayload);
  });

  it('should correctly create error message with undefined keyTitle', () => {
    const serverErrorMessage = 'Error';

    expect(createErrorMessage(serverErrorMessage)).toBe('Error');
  });

  it('should correctly create error message with keyTitle', () => {
    const serverErrorMessage = 'Error';
    const keyTitle = 'Field name';

    expect(createErrorMessage(serverErrorMessage, keyTitle)).toBe('Field name: Error');
  });

  it('should correctly create error message with keyTitle in serverErrorMessage', () => {
    const serverErrorMessage = 'Field name is required';
    const keyTitle = 'Field name';

    expect(createErrorMessage(serverErrorMessage, keyTitle)).toBe('Field name is required');
  });

  it('should form correct validation messages without context', () => {
    const response = {
      response: {
        details: {
          errors: [{ message: 'error' }],
        },
      },
    } as any;
    const formData = {
      components: [],
      title: '',
      name: '',
      path: '',
    };
    expect(getValidationErrors(i18n as any, response, formData))
      .toEqual([{ type: ERROR_TYPE.VALIDATION, message: 'error', details: response.response.details.errors[0] }]);
  });

  it('should form correct validation messages with context', () => {
    const response = {
      response: {
        details: {
          errors: [{ message: 'error', field: 'test.test' }],
        },
      },
    } as any;
    const formData = {
      components: [{ label: 'Test', key: 'test.test' }],
    } as any;
    expect(getValidationErrors(i18n as any, response, formData)).toEqual([
      { type: ERROR_TYPE.VALIDATION, message: 'regulation:Test: error', details: response.response.details.errors[0] },
    ]);
  });

  it('should form correct validation messages with error code', () => {
    const response = {
      response: {
        code: 'CSV_VALIDATION_ERROR',
        details: {
          errors: [{ message: 'error', field: 'test.test' }],
        },
      },
    } as any;
    const formData = {
      components: [{ label: 'Test', key: 'test.test' }],
    } as any;
    expect(getValidationErrors(i18n as any, response, formData)).toEqual([
      { type: ERROR_TYPE.VALIDATION, message: i18n.t('errors:validation.CSV_VALIDATION_ERROR') },
    ]);
  });
});
