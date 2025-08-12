import { create } from "zustand";
import { AssessmentAreaEvaluation } from "@/model/documentModels";
import { fetchAssessmentEvaluation } from "@/services/documentService";

interface PromptEvaluationStore {
  evaluations: Map<number, AssessmentAreaEvaluation> | object;
  fetchAndSetAssessmentEvaluation: (doc_summary_id: number, assessment_ids: number) => Promise<AssessmentAreaEvaluation>;
};

export const usePromptEvaluationStore = create<PromptEvaluationStore>((set) => ({
  evaluations: {},

  fetchAndSetAssessmentEvaluation: async (doc_summary_id: number, assessment_id: number) => {
    const evaluation: AssessmentAreaEvaluation = await fetchAssessmentEvaluation(doc_summary_id, assessment_id);
    set((state) => ({
      evaluations: {...state.evaluations, evaluation}
    }));
    return evaluation;
  }
}));
