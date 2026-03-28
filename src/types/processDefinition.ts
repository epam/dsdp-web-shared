export interface ProcessDefinition {
  id: string;
  key: string;
  category: string;
  description: string | null;
  name: string;
  version: number;
  resource: string;
  deploymentId: string;
  diagram: string | null;
  suspended: boolean;
  tenantId: string | null;
  versionTag: string | null;
  historyTimeToLive: string | null;
  startableInTasklist: boolean;
  formKey: string;
}

export interface ProcessDefinitionGroup {
  name: string;
  processDefinitions: Array<ProcessDefinition>;
}

export interface ProcessDefinitionGroupData {
  groups: Array<ProcessDefinitionGroup>;
  ungrouped: Array<ProcessDefinition>
}
