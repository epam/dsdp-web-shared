import type { AjaxError } from 'rxjs/ajax';

import { ERROR_TYPE, type ErrorInfo, type ServerValidationError } from '#shared/types/common';
import type { TaskSubmissionPayload, TaskData } from '#shared/types/task';
import type { i18n as I18n } from 'i18next';
import get from 'lodash/get';
import type { Form, FormSubmission } from '#web-components/components/Form/types';
import { getServerValidationErrors } from '#shared/utils/apiHelpers';
import { REGULATION_NS, SERVER_MESSAGES_NS } from '#shared/constants/common';

export const formatFormSubmissionToTaskData = (
  submission: FormSubmission,
): TaskSubmissionPayload => {
  return {
    data: submission.data,
  };
};

export const formatTaskDataToFormSubmission = (
  data?: TaskData,
): FormSubmission => {
  return { data: data || {} };
};

export const createErrorMessage = (serverErrorMessage: string, keyTitle?: string): string => {
  const shouldMessageBeWithTitle = keyTitle && !serverErrorMessage.includes(keyTitle);
  return shouldMessageBeWithTitle ? `${keyTitle}: ${serverErrorMessage}` : serverErrorMessage;
};

export function getLocalizedMessage(
  serverError: ServerValidationError,
  i18n: I18n,
  formData?: Form | null,
): string {
  let serverErrorMessage = serverError.message;
  if (serverError.messageKey) {
    serverErrorMessage = (i18n.exists(serverError.messageKey, { ns: REGULATION_NS })
      ? i18n.t(serverError.messageKey, { ns: REGULATION_NS })
      : i18n.t(
        `${SERVER_MESSAGES_NS}${i18n.options.nsSeparator}${serverError.messageKey}`,
        serverError.messageParams,
      ));
  }
  const contextComponent = (formData?.components || []).find((component) => component.key === serverError.field);
  const keyTitle = contextComponent?.label
      && i18n.t(`${REGULATION_NS}${i18n.options.nsSeparator}${contextComponent.label}`);
  const message = createErrorMessage(
    serverErrorMessage,
    keyTitle,
  );

  return message;
}

export const getValidationErrors = (i18n: I18n, response: AjaxError, formData?: Form | null): Array<ErrorInfo> => {
  const errorCode = get(response.response, 'code', '');

  const getNumberFromListSizeValidation = () => {
    const originalMessage = get(response.response, 'details.errors[0].message') as string | undefined;
    const max = parseInt(originalMessage?.split(' ').pop() || '', 10);
    if (errorCode !== 'LIST_SIZE_VALIDATION_ERROR' || Number.isNaN(max)) {
      return null;
    }
    return max;
  };

  if (errorCode && i18n.exists(`errors:validation.${errorCode}`)) {
    const max = getNumberFromListSizeValidation();
    return [{
      message: i18n.t(`errors:validation.${errorCode}`, max ? { max } : undefined),
      type: ERROR_TYPE.VALIDATION,
    }];
  }

  const serverErrors = getServerValidationErrors(response);
  return serverErrors.map((serverError) => ({
    message: getLocalizedMessage(serverError, i18n, formData),
    type: ERROR_TYPE.VALIDATION,
    details: serverError,
  }));
};
