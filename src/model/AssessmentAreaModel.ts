export interface AssessmentArea {
  assessment_id?: number;
  assessment_name?: string;
  name?: string; // Added for mock-server compatibility
  description?: string;
  created_by?: string;
  created_on?: string;  
  updated_by?: string;
  updated_on?: string;
  prompt_ids: number[] | null;
}
