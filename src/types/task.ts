export type TaskData<T = Record<string, unknown>> = T;

export type TaskSubmissionPayload = {
  data: TaskData;
};

export type SignTaskPayload = {
  signature: string;
  data: TaskData;
};

export interface UserTask extends TaskSubmissionPayload {
  id: string;
  name: string;
  assignee: null | string;
  created: string; // "2020-11-30T11:52:00"
  description: null | string;
  processDefinitionName?: string;
  processInstanceId: string;
  processDefinitionId: string;
  rootProcessInstanceId: string;
  formKey: string;
  formVariables?: Record<string, unknown>;
  suspended: boolean;
  esign: boolean;
  payment: boolean;
}

export interface UserTaskHistory {
  activityInstanceId: string,
  taskDefinitionKey: string,
  taskDefinitionName: string,
  processInstanceId: string,
  processDefinitionId: string,
  processDefinitionKey: string,
  processDefinitionName: string,
  startTime: string,
  endTime: string,
  assignee: string
}

export type UserTaskCompleteResponse = {
  id: string,
  processInstanceId: string,
  rootProcessInstanceId: string,
  rootProcessInstanceEnded: boolean,
};

export type UserTaskIdsResponse = {
  id: string,
  assignee: string,
};
