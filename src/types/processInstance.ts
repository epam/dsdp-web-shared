interface ProcessInstanceListItemCommon {
  businessKey: string;
  processDefinitionId: string;
  processDefinitionKey: string;
  processDefinitionName: string;
  processInstanceId: string;
  superProcessInstanceId: string;
  startTime: string,
  startUserId: string;
}

export interface ProcessInstanceHistoryListItem extends ProcessInstanceListItemCommon {
  endTime: string;
  excerptId: string;
  status: {
    code: ProcessInstanceHistoryStatusCode,
    title: string,
  },
}

export enum ProcessInstanceStatusCode {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

export enum ProcessInstanceHistoryStatusCode {
  COMPLETED = 'COMPLETED',
  EXTERNALLY_TERMINATED = 'EXTERNALLY_TERMINATED',
  INTERNALLY_TERMINATED = 'INTERNALLY_TERMINATED',
}
export interface ProcessInstanceListItem extends ProcessInstanceListItemCommon {
  status: {
    code: ProcessInstanceStatusCode,
    title: string,
  },
}
