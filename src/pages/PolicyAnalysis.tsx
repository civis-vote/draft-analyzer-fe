import UploadSection from "@/components/upload-section/UploadSection";
import InsightSection from "@/components/upload-section/evaluation/InsightSection";
import PromptEvaluation from "@/components/upload-section/evaluation/PromptEvaluation";
import { useDocumentStore } from "@/store/documentStore";
import ScoreAnalysis from "@/components/upload-section/evaluation/ScoreAnalysis";
import RightSidebar from "@/components/sidebar/RightSidebar";

export default function Home() {
  const { summaryRequested } = useDocumentStore();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4 lg:px-4">
      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Main Content */}
        <div className="md:col-span-3 space-y-10">
          <UploadSection />

          {summaryRequested && (
            <>
              <InsightSection />
              <PromptEvaluation />
              <ScoreAnalysis />
            </>
          )}
        </div>
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-20">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}


