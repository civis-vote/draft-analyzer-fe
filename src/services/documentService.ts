import axios from "axios";
import { UploadResponse, SummaryRequest, SummaryResponse, DocumentType, Assessment, AssessmentPrompt, UploadRequest } from "@/model/DocumentModels";
import { EvaluationResponse, EvaluationRequest } from "@/model/EvaluationModels";
import { ScoreAnalysisRequest, ScoreAnalysisResponse } from "@/model/ScoreAnalysisModels";

const BASE_URL = "http://localhost:8000/api";

export const uploadDocument = async (request: UploadRequest): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", request.file);

  const response = await fetch(`${BASE_URL}/upload_policy`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Upload failed:", error);
    throw new Error(error || "Upload failed");
  }

  return response.json();
}
export const createDocument = async (newDocument: UploadResponse): Promise<UploadResponse> => {
  const response = await axios.post(`${BASE_URL}/create_document`, newDocument);
  return response.data;
};

export const fetchSummary = async (request: SummaryRequest): Promise<SummaryResponse> => {
  const response = await axios.post<SummaryResponse>(`${BASE_URL}/summarize`, request);
  return response.data;
};


export const getDocumentTypes = async (): Promise<DocumentType[]> => {
  const response = await axios.get<DocumentType[]>(`${BASE_URL}/document_types`);
  return response.data;
};

export const getAssessmentsByDocumentType = async (doc_type_id: number): Promise<Assessment[]> => {
  const response = await axios.get<Assessment[]>(`${BASE_URL}/document_types/${doc_type_id}/assessments`);
  return response.data;
};

export const getAssessmentPrompts = async (assessmentId: number): Promise<AssessmentPrompt[]> => {
  const response = await axios.get<AssessmentPrompt[]>(`${BASE_URL}/assessments/${assessmentId}/prompts`);
  return response.data;
};

export const fetchPromptEvaluations = async (
  req: EvaluationRequest
): Promise<EvaluationResponse> => {
  const response = await axios.post<EvaluationResponse>(
    `${BASE_URL}/evaluations`,
    req
  );
  return response.data;
};

export const fetchScoreAnalysis = async (
  req: ScoreAnalysisRequest
): Promise<ScoreAnalysisResponse> => {
  const res = await fetch(`${BASE_URL}/score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch score analysis");
  }

  return res.json();
};