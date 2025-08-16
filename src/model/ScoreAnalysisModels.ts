export interface ScoreAnalysisRequest {
  doc_summary_id: number;
}

export interface ScoreAnalysisResponse {
  assessment_id: number;
  prompt_id: number;
  criteria: string;
  prompt_score: number;
  max_score: number;
}
