import React from "react";
import { Button, Card, Descriptions, message } from "antd";
import { UploadResponse } from "@/model/DocumentModels";
import { downloadSummaryReport } from "@/services/documentService";
import { useDocumentSummaryStore } from "@/store/documentSummaryStore";
import { useProgressTrackerStore } from "@/store/progressTrackerStore";
import { ProgressStepKey } from "@/constants/ProgressStepKey";
import { ProgressStepStatus } from "@/constants/ProgressStatus";

const formatFileSize = (sizeKb: number) => {
  return sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(2)} MB` : `${sizeKb} KB`;
};

const DocumentMetadataCard: React.FC<{ document: UploadResponse }> = ({
  document,
}) => {

  const updateStepStatus = useProgressTrackerStore((state) => state.updateStepStatus);
  const handleSummaryDownload = async () => {
    const doc_summary_id = useDocumentSummaryStore.getState().summary?.doc_summary_id;
    if (!doc_summary_id) {
      message.error('No summary available for download');
      return;
    }
    
    try {
      updateStepStatus(ProgressStepKey.Download, ProgressStepStatus.InProgress);
      await downloadSummaryReport(doc_summary_id);
      message.success('Summary report downloaded successfully');
      updateStepStatus(ProgressStepKey.Download, ProgressStepStatus.Completed);
    } catch (error) {
      message.error('Download failed');
      updateStepStatus(ProgressStepKey.Download, ProgressStepStatus.Error);
    }
  };

  return (
    <Card
      title="Uploaded Document Details"
      className="w-full bg-gray-50 rounded-xl mt-6 shadow"
      styles={{
        header: {
          fontSize: "1rem",
          fontWeight: "600",
          backgroundColor: "#f0f8ff",
        },
      }}
    >
      <Descriptions
        column={1}
        styles={{ label: { fontWeight: 500, color: "#4a4a4a" } }}
        size="small"
      >
        <Descriptions.Item label="File Name">
          <div className="flex items-center min-h-[1.5rem]">
            <span className="text-xs text-gray-700">{document.file_name}</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Pages">
          <div className="flex items-center min-h-[1.5rem]">
            <span className="text-xs text-gray-700">{document.number_of_pages}</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Size">
          <div className="flex items-center min-h-[1.5rem]">
            <span className="text-xs text-gray-700">{formatFileSize(document.doc_size_kb)}</span>
          </div>
        </Descriptions.Item>
      </Descriptions>{" "}
      <div className="flex items-center justify-center mt-4">
        <Button type="primary" ghost onClick={handleSummaryDownload}>
          Download Summary Report
        </Button>
      </div>
    </Card>
  );
};

export default DocumentMetadataCard;
