import { useState } from "react";
import {
  Upload,
  Progress,
  Typography,
  Card,
  Button,
  message,
} from "antd";
import type { UploadProps } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useDocumentStore } from "@/store/documentStore";
import AssessmentsSection from "@/components/AssessmentsSection";
import { DocumentType, UploadResponse } from "@/model/DocumentModels";
import DocumentMetadataCard from "./DocumentMetadataCard";
import DocumentTypeSelector from "./DocumentTypeSelector";
import { uploadDocument } from "@/services/documentService";

const { Dragger } = Upload;
const { Title, Paragraph, Text } = Typography;

export default function UploadSection() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showSummarize, setShowSummarize] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const setSummaryRequested = useDocumentStore(
    (state) => state.setSummaryRequested
  );
  const setUploadResponse = useDocumentStore(
    (state) => state.setUploadResponse
  );

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setSummaryRequested(false);
    setSelectedDocType(null);
    setError(null);
    const sessionId = "abc123"; // Replace with actual sessionId logic
    const userId = "user456"; // Replace with actual userId logic
    const documentName = file.name;

    try {
      const res: UploadResponse = await uploadDocument({
        file,
        sessionId,
        userId,
        documentName,
      });
      message.success("File uploaded successfully");
      setUploadResponse(res);
      setShowSummarize(true);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const proceedWithSummarization = () => {
    setSummaryRequested(true);
    const summarySection = document.getElementById("summary-section");
    if (summarySection) {
      summarySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const props: UploadProps = {
    multiple: false,
    beforeUpload: (file) => {
      setUploadedFile(file);
      handleUpload(file);
      return false;
    },
    showUploadList: false,
    accept: ".pdf,.doc,.docx,.txt",
  };

  return (
  <Card className="shadow-lg rounded-2xl p-6 mx-auto mt-8 mb-16">
    <div className="flex flex-col items-center gap-6">
      <div className="text-center mt-4">
        <Title level={3} style={{ margin: 0, color: "#1f2937" }}>
          Document Analyzer
        </Title>
        <Paragraph type="secondary">
          Upload your document and select its type to begin analysis
        </Paragraph>
      </div>

      <div className="w-full px-6 max-w-lg">
        <Dragger {...props} style={{ padding: 24 }}>
          <CloudUploadOutlined
            style={{
              fontSize: "2.5rem",
              color: "#9ca3af",
              marginBottom: "0.5rem",
            }}
          />
          <p className="ant-upload-text text-base font-medium">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint text-gray-500 text-sm">
            Supported formats: .pdf, .doc, .docx, .txt
          </p>
        </Dragger>
      </div>

      {isUploading && (
        <div className="w-11/12 mt-4">
          <Progress percent={uploadProgress} status="active" />
        </div>
      )}

      {error && (
        <div className="text-red-500 mt-2">
          <Text type="danger">{error}</Text>
        </div>
      )}

      {!isUploading && uploadedFile && showSummarize && (
        <div className="w-full px-6 flex flex-col items-center gap-6">
          {useDocumentStore.getState().uploadResponse && (
            <DocumentMetadataCard
              document={
                useDocumentStore.getState().uploadResponse as UploadResponse
              }
            />
          )}

          <DocumentTypeSelector onSelect={setSelectedDocType} />

          {selectedDocType && (
            <>
              <AssessmentsSection documentType={selectedDocType} />
              <div className="mt-4">
                <Button type="primary" ghost onClick={proceedWithSummarization}>
                  Proceed with Analysis
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  </Card>
);

}
