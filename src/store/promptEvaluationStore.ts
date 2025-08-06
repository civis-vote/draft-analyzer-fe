import { create } from "zustand";
import { AssessmentAreaEvaluation } from "@/model/DocumentModels";
import { fetchPromptEvaluations } from "@/services/documentService";

interface PromptEvaluationStore {
  evaluations: AssessmentAreaEvaluation[] | null;
  fetchAndSetAssessmentEvaluations: (doc_summary_id: number, assessment_ids: number[]) => AssessmentAreaEvaluation[];
}

export const usePromptEvaluationStore = create<PromptEvaluationStore>((set) => ({
  evaluations: null,

  fetchAndSetAssessmentEvaluations: (doc_summary_id: number, assessment_ids: number[]) => {
    // iterate through all assessment_id in assessment_ids 
    // call fetchPromptEvaluation service with doc_summary_id and assessment_id
    // wait for all the promises to resolve and set the evaluations state
    // return evaluations
    return;
  }
}));
