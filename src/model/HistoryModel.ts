export interface HistoryResponse {
    history: DocumentHistory[];
}

export interface DocumentHistory {
    doc_type_id: number;
    doc_summary_id: number;
    file_name: string;
    summary_time: string;
    status: string;
    doc_type: string;
}

export interface ExecutiveSummary {
    doc_summary_id: number;
    executive_summary_text: string;
}

export interface SummaryState {
  text: string;
  loading: boolean;
  error: string | null;
}