import React from "react";
import { Card, Descriptions, Tag } from "antd";
import { UploadResponse } from "@/model/DocumentModels";


const formatFileSize = (sizeKb: number) => {
  return sizeKb >= 1024
    ? `${(sizeKb / 1024).toFixed(2)} MB`
    : `${sizeKb} KB`;
};

const DocumentMetadataCard: React.FC<{ document: UploadResponse }> = ({ document }) => {
  return (
    <Card
      title="Uploaded Document Details"
      className="w-full max-w-5xl mx-auto mt-4 shadow-lg rounded-xl text-center"
      headStyle={{ fontSize: "1.1rem", fontWeight: "bold" }}
    >
      <Descriptions
        column={1}
        labelStyle={{ fontWeight: 600 }}
        size="middle"
        layout="horizontal"
      >
        <Descriptions.Item label="Document ID">
          <Tag color="blue">{document.doc_id}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="File Name">{document.file_name}</Descriptions.Item>
        <Descriptions.Item label="File Type">
          <Tag color="purple">{document.file_type}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Number of Pages">{document.number_of_pages}</Descriptions.Item>
        <Descriptions.Item label="File Size">{formatFileSize(document.doc_size_kb)}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default DocumentMetadataCard;
