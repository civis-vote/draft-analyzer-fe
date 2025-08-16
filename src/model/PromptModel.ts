
export interface Prompt {
  prompt_id?: number;
  prompt_type: PromptType;
  criteria: string;
  description: string;
  technical_prompt?: string;
  created_by: string;
  created_on?: string;
  updated_by?: string;
  updated_on?: string;
}

export enum PromptType {
  ASSESSMENT = "ASSESSMENT",
  VALIDATION = "VALIDATION",
  SUMMARY = "SUMMARY",
  EXECUTIVE_SUMMARY = "EXECUTIVE_SUMMARY"
}

