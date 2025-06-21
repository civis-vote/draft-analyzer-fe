import { create } from 'zustand';
import {
  getAssessmentAreas,
  createAssessmentArea,
  updateAssessmentArea,
  deleteAssessmentArea,
} from '@/services/prompt-dashboard/assessmentAreaService';
import { AssessmentArea } from '@/model/AssessmentAreaModel';

interface AssessmentAreaStore {
  assessmentAreas: AssessmentArea[];
  assessmentAreasLoading: boolean;
  assessmentAreasError: string | null;
  fetchAssessmentAreas: () => Promise<void>;
  addAssessmentArea: (area: AssessmentArea) => Promise<void>;
  updateAssessmentAreaById: (area: AssessmentArea) => Promise<void>;
  deleteAssessmentAreaById: (id: number) => Promise<void>;
}

export const useAssessmentAreaStore = create<AssessmentAreaStore>((set, get) => ({
  assessmentAreas: [],
  assessmentAreasLoading: false,
  assessmentAreasError: null,

  fetchAssessmentAreas: async () => {
    set({ assessmentAreasLoading: true, assessmentAreasError: null });
    try {
      const areas = await getAssessmentAreas();
      set({ assessmentAreas: areas });
    } catch {
      set({ assessmentAreasError: 'Failed to fetch assessment areas' });
    } finally {
      set({ assessmentAreasLoading: false });
    }
  },

  addAssessmentArea: async (area) => {
    const created = await createAssessmentArea(area);
    set((state) => ({
      assessmentAreas: [...state.assessmentAreas, created],
    }));
  },

  updateAssessmentAreaById: async (area) => {
    const updated = await updateAssessmentArea(area);
    set((state) => ({
      assessmentAreas: state.assessmentAreas.map((a) =>
        a.assessment_id === updated.assessment_id ? updated : a
      ),
    }));
  },

  deleteAssessmentAreaById: async (id) => {
    await deleteAssessmentArea(id);
    set((state) => ({
      assessmentAreas: state.assessmentAreas.filter((a) => a.assessment_id !== id),
    }));
  },
}));
