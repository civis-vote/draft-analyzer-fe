// Upload Request 
export interface UploadRequest {
  file: File;
  sessionId: string;
  userId: string;
  documentName: string;
}


// Upload response
export interface UploadResponse {
  doc_id: string;
  file_name: string;
  file_type: string;
  number_of_pages: number;
  doc_size_kb: number;
}

// Summarize request
export interface SummaryRequest {
  doc_id: string;
}

// Summarize response (used in InsightSection)
export interface SummaryResponse {
  doc_summary_id: number;
  doc_id: string;
  summary_text: string;
}

export interface DocumentType {
  doc_type_id: number;
  doc_type_name: string;
  description: string;
  doc_validation_prompt: number;
  created_by: string;
  created_on: string; 
  updated_by: string | null;
  updated_on: string | null;
  assessment_ids: number[] | null;
}

export interface AssessmentPrompt {
  id: number;
  description: string;
  category: string;
  isRequired: boolean;
}

export interface Assessment {
  id: number;
  title: string;
  description: string;
  prompts: AssessmentPrompt[];
}

export interface DocumentTypeAssessment {
  documentType: DocumentType;
  assessments: Assessment[];
}

// Document validation response
export interface DocumentValidationResponse {
  doc_summary_id: number;
  doc_id: string;
  doc_type_id: number;
  is_valid_document: boolean;
  doc_valid_status_msg: string;
}

export interface DocumentSummary {
  doc_summary_id: number;
  doc_id: string;
  doc_type_id: number;
  is_valid_document: boolean;
  doc_valid_status_msg: string;
  summary_text: string | null;
}

export interface PromptScore {
  prompt_score_id: number,
  assessment_summary_id: number,
  prompt_id: number,
  prompt_score: number,
  max_score: number,
  score_justification: string,
  reference: string
}

export interface AssessmentAreaEvaluation {
  assessment_area_summary: number;
  assessment_id: number;
  summary: string;
  overall_score: number;
  prompt_scores: PromptScore[];
}
