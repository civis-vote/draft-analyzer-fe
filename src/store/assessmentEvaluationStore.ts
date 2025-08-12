import { create } from "zustand";
import { AssessmentAreaEvaluation } from "@/model/documentModels";
import { fetchAssessmentEvaluation } from "@/services/documentService";

interface AssessmentEvaluationStore {
  evaluations: Map<number, AssessmentAreaEvaluation> | object;
  evluationsError: Map<number, any> | object;
  fetchAndSetAssessmentEvaluation: (doc_summary_id: number, assessment_ids: number) => Promise<AssessmentAreaEvaluation>;
  setEvaluationError: (assessment_id: number, evaluationError: any) => void;
};

export const useAssessmentEvaluationStore = create<AssessmentEvaluationStore>((set) => ({
  evaluations: {},
  evluationsError: {},

  fetchAndSetAssessmentEvaluation: async (doc_summary_id: number, assessment_id: number) => {
    const evaluation: AssessmentAreaEvaluation = await fetchAssessmentEvaluation(doc_summary_id, assessment_id);
    set((state) => ({
      evaluations: {...state.evaluations, [assessment_id]: evaluation}
    }));
    return evaluation;
  },

  setEvaluationError: (assessment_id:number, evaluationError: any) => {
    set((state) => ({
      evluationsError: {...state.evluationsError, [assessment_id]: evaluationError}
    }))
  }
  
}));
