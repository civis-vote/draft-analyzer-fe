export enum ProgressStepStatus {
  Pending = "pending",
  InProgress = "in-progress",
  Completed = "completed",
  Error = "error",
}

export type StepStatus = keyof typeof ProgressStepStatus | ProgressStepStatus;
