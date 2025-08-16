import { create } from "zustand";
import { DocumentSummary, SummaryResponse } from "@/model/DocumentModels";
import {
  getDocumentValidationStatus,
  summarizeDocument,
} from "@/services/documentService";

interface DocumentSummaryStore {
  summary: DocumentSummary | null;
  getSummary: (doc_type: number) => Promise<DocumentSummary | null>;
  updateSummary: (summary: DocumentSummary) => void;
  fetchAndSetSummaryText: (doc_summary_id: number) => Promise<SummaryResponse>;
  reset: () => void;
}

export const useDocumentSummaryStore = create<DocumentSummaryStore>((set) => ({
  summary: null,

  reset: () => set({ summary: null }),
  getSummary: async (doc_type: number) => {
    try {
      const summary = await getDocumentValidationStatus(doc_type);
      set({ summary });
      return summary;
    } catch (error) {
      console.error("Failed to get document summary:", error);
      return null;
    }
  },

  updateSummary: (summary) => {
    set({ summary });
  },

  fetchAndSetSummaryText: async (doc_summary_id: number) => {
    if (!doc_summary_id || doc_summary_id <= 0) {
      return Promise.reject("Document summary ID is required");
    }
    try {
      const summaryResponse: SummaryResponse = await summarizeDocument(
        doc_summary_id
      );
      if (!summaryResponse) {
        throw new Error("No summary data received");
      }

      set((state) => ({
        summary: {
          ...state.summary!,
          summary_text: summaryResponse.summary_text || "No summary available",
        },
      }));

      return summaryResponse;
    } catch (error) {
      console.error("Failed to fetch and set summary text:", error);
      throw error;
    }
  },
}));
