import React from "react";
import { Card, Descriptions } from "antd";
import { UploadResponse } from "@/model/DocumentModels";

const formatFileSize = (sizeKb: number) => {
  return sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(2)} MB` : `${sizeKb} KB`;
};

const DocumentMetadataCard: React.FC<{ document: UploadResponse }> = ({
  document,
}) => {
  return (
    <Card
      title="Document Info"
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
        labelStyle={{ fontWeight: 500, color: "#4a4a4a" }}
        size="small"
      >
        <Descriptions.Item label="Document ID">
          <div className="flex items-center min-h-[1.5rem]">
            <span className="text-xs text-gray-700">{document.doc_id}</span>
          </div>
        </Descriptions.Item>
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
    </Card>
  );
};

export default DocumentMetadataCard;
