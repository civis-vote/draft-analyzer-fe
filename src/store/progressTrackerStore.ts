import { create } from "zustand";
import {
  UploadIcon,
  FileSearch,
  FileText,
  MessageSquareQuote,
  BarChart4,
  Download,
  NotebookPen,
} from "lucide-react";
import { ProgressStepStatus } from "@/constants/ProgressStatus";
import { ProgressStepKey } from "@/constants/ProgressStepKey";

export interface Step {
  key: ProgressStepKey;
  label: string;
  icon: React.ElementType;
  status: ProgressStepStatus;
}

interface ProgressTrackerState {
  steps: Step[];
  updateStepStatus: (key: ProgressStepKey, status: ProgressStepStatus) => void;
  resetSteps: () => void;
}

export const useProgressTrackerStore = create<ProgressTrackerState>((set) => ({
  steps: [
    { key: ProgressStepKey.Upload, label: "Upload", icon: UploadIcon, status: ProgressStepStatus.Pending },
    { key: ProgressStepKey.DocumentValidation, label: "Document Validation", icon: FileSearch, status: ProgressStepStatus.Pending },
    { key: ProgressStepKey.Summarize, label: "Summarize Document", icon: FileText, status: ProgressStepStatus.Pending },
    { key: ProgressStepKey.Evaluate, label: "Document Evaluation", icon: MessageSquareQuote, status: ProgressStepStatus.Pending },
    { key: ProgressStepKey.Score, label: "Score Analysis", icon: BarChart4, status: ProgressStepStatus.Pending },
    { key: ProgressStepKey.ExecutiveSummary, label: "Executive Summary", icon: NotebookPen, status: ProgressStepStatus.Pending },
    { key: ProgressStepKey.Download, label: "Download Report", icon: Download, status: ProgressStepStatus.Pending },
  ],
  updateStepStatus: (key, status) =>
    set((state) => ({
      steps: state.steps.map((step) =>
        step.key === key ? { ...step, status } : step
      ),
    })),
  resetSteps: () =>
    set((state) => ({
      steps: state.steps.map((step) => ({ ...step, status: ProgressStepStatus.Pending })),
    })),
}));
