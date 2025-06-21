import UploadSection from "@/components/upload-section/UploadSection";
import InsightSection from "@/components/InsightSection";
import PromptEvaluation from "@/components/PromptEvaluation";
import { useDocumentStore } from "@/store/documentStore";
import ScoreAnalysis from "@/components/ScoreAnalysis";

export default function Home() {
  const { summaryRequested } = useDocumentStore();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <UploadSection />

        {summaryRequested && (
          <>
            <InsightSection />
            <PromptEvaluation />
            <ScoreAnalysis />
          </>
        )}
      </div>
    </div>
  );
}

