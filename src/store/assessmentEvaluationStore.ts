import { create } from "zustand";
import { fetchAssessmentEvaluation } from "@/services/documentService";
import { AssessmentAreaEvaluation } from "@/model/DocumentModels";

interface AssessmentEvaluationStore {
  evaluations: Map<number, AssessmentAreaEvaluation> | object;
  evaluationsError: Map<number, any> | object;
  evaluationsCount: number;
  fetchAndSetAssessmentEvaluation: (doc_summary_id: number, assessment_ids: number) => Promise<AssessmentAreaEvaluation>;
  setEvaluationError: (assessment_id: number, evaluationError: any) => void;
  reset: () => void;
};

export const useAssessmentEvaluationStore = create<AssessmentEvaluationStore>((set) => ({
  evaluations: {},
  evaluationsError: {},
  evaluationsCount: 0,

  reset: () => set({ evaluations: {}, evaluationsError: {}, evaluationsCount: 0 }),
  
  fetchAndSetAssessmentEvaluation: async (doc_summary_id: number, assessment_id: number) => {
    // Delay 5 seconds to avoid timeouts
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const evaluation: AssessmentAreaEvaluation = await fetchAssessmentEvaluation(doc_summary_id, assessment_id);
    set((state) => ({
      evaluations: {...state.evaluations, [assessment_id]: evaluation},
      evaluationsCount: state.evaluationsCount + 1
    }));
    return evaluation;
  },

  setEvaluationError: (assessment_id:number, evaluationError: any) => {
    set((state) => ({
      evaluationsError: {...state.evaluationsError, [assessment_id]: evaluationError},
      evaluationsCount: state.evaluationsCount + 1
    }))
  }
  
}));
