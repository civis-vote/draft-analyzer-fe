export interface EvaluationItem {
  description: string;
  answer: string;
  score: number;
}

export interface EvaluationResponse {
  evaluations: EvaluationItem[];
}

export interface EvaluationRequest {
  docId: string;
}

export interface PromptScore {
  prompt_score_id?: number | null;
  assessment_summary_id: number;
  prompt_id: number;
  prompt_score?: number | null;
  max_score?: number | null;
  score_justification?: string | null;
  reference?: string | null;
}

export interface AssessmentAreaSummary {
  assessment_summary_id: number;
  assessment_id: number;
  summary: string;
  overall_score: number;
  prompt_scores: PromptScore[];
}
