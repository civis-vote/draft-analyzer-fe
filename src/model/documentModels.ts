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
  document_id: string;
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
  doc_id: string;
  doc_status: string;
  doc_status_message: string;
}