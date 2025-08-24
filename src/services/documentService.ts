import axios from "axios";
import { UploadResponse, SummaryResponse, DocumentType, Assessment, AssessmentPrompt, UploadRequest, DocumentSummary, AssessmentAreaEvaluation } from "@/model/DocumentModels";
import { ScoreAnalysisResponse } from "@/model/ScoreAnalysisModels";
import { useDocumentStore } from "@/store/documentStore";
import { ExecutiveSummary } from "@/model/HistoryModel";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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

export const summarizeDocument = async (doc_summary_id: number): Promise<SummaryResponse> => {
  const response = await axios.get<SummaryResponse>(`${BASE_URL}/summarize/${doc_summary_id}`);
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

export const getDocumentValidationStatus = async (doc_type_id: number): Promise<DocumentSummary> => {

  const doc_id = useDocumentStore.getState().uploadResponse?.doc_id;
  if (!doc_id || !doc_type_id) {
    throw new Error("Document ID and Document Type ID are required for validation.");
  }
  const response = await axios.get<DocumentSummary>(`${BASE_URL}/document/${doc_id}/document-type/${doc_type_id}/validate`);
  return response.data;
};

export const downloadSummaryReport = async (doc_summary_id: number) => {

  const response = await axios.get(`${BASE_URL}/report/download/${doc_summary_id}`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `draft_policy_report_${doc_summary_id}.pdf`);
  link.click();
  window.URL.revokeObjectURL(url);
};

export const fetchAssessmentEvaluation = async (
  doc_summary_id: number, assessment_id: number
): Promise<AssessmentAreaEvaluation> => {
  const response = await axios.get<AssessmentAreaEvaluation>(
    `${BASE_URL}/summary/${doc_summary_id}/assessment/${assessment_id}`,
  );
  return response.data;
};

export const fetchScoreAnalysis = async (
  doc_summary_id: number
): Promise<ScoreAnalysisResponse[]> => {
  const res = await axios.get<ScoreAnalysisResponse[]>(`${BASE_URL}/prompt_score/${doc_summary_id}`,
   );

  if (res.status < 200 || res.status >= 300) {
    throw new Error("Failed to fetch score analysis");
  }

  return res.data;
};

export const generateExecutativeSummary = async (doc_summary_id: number): Promise<ExecutiveSummary> => {
  
  const response = await axios.get(`${BASE_URL}/executive-summary/${doc_summary_id}`);
  if (response.status !== 200) {
    throw new Error("Failed to generate executive summary");
  }
  return response.data;
};