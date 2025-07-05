import { useDocumentStore } from "@/store/documentStore";
import DocumentMetadataCard from "./DocumentMetadataCard";
import ProgressTracker from "./ProgressTracker";

const RightSidebar = () => {
  const uploadResponse = useDocumentStore((state) => state.uploadResponse);

  return (
    <aside className="sticky top-6 h-fit flex flex-col gap-4">
      <ProgressTracker />
      {uploadResponse && (
        <DocumentMetadataCard document={uploadResponse} />
      )}
    </aside>
  );
};

export default RightSidebar;
