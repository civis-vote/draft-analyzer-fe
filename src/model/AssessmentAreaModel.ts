export interface AssessmentArea {
  assessment_id?: number;
  assessment_name?: string;
  description?: string;
  summary_prompt?: number;
  created_by?: string;
  created_on?: string;  
  updated_by?: string;
  updated_on?: string;
  prompt_ids: number[] | null;
}
