import { useState } from "react";
import {
  Upload,
  Typography,
  Card,
  Button,
  message,
  Spin,
  Modal,
} from "antd";
import type { UploadProps } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useDocumentStore } from "@/store/documentStore";
import AssessmentsSection from "@/components/upload-section/assessment-framework/AssessmentsSection";
import { DocumentSummary, DocumentType, UploadResponse } from "@/model/DocumentModels";
import DocumentTypeSelector from "./DocumentTypeSelector";
import { uploadDocument } from "@/services/documentService";
import { ProgressStepKey } from "@/constants/ProgressStepKey";
import { useProgressTrackerStore } from "@/store/progressTrackerStore";
import { ProgressStepStatus } from "../../constants/ProgressStatus";
import { useDocumentSummaryStore } from "@/store/documentSummaryStore";
import { useAssessmentEvaluationStore } from "@/store/assessmentEvaluationStore";

const { Dragger } = Upload;
const { Title, Paragraph, Text } = Typography;


export default function UploadSection() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null);
  const [isDocTypeDisabled, setIsDocTypeDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValidationWarning, setShowValidationWarning] = useState(false);
  const [validationResponse, setValidationResponse] = useState<DocumentSummary | null>(null);
  const [proceedClicked, setProceedClicked] = useState(false);

  const setSummaryRequested = useDocumentStore(state => state.setSummaryRequested);
  const setUploadResponse = useDocumentStore(state => state.setUploadResponse);

  const sessionId = "abc123"; // Replace with real logic
  const userId = "user456"; // Replace with real logic

  const resetUploadState = () => {

    setProceedClicked(false);
    useProgressTrackerStore.getState().resetSteps?.();

    // Reset local state
    setSelectedDocType(null);
    setIsDocTypeDisabled(false);
    setError(null);

    // Reset document store flags
    setSummaryRequested(false);
    setUploadResponse(null);
    useDocumentSummaryStore.getState().reset();
    useAssessmentEvaluationStore.getState().reset();
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    resetUploadState();
    useProgressTrackerStore.getState().updateStepStatus(ProgressStepKey.Upload, ProgressStepStatus.InProgress);
    try {
      const res: UploadResponse = await uploadDocument({
        file,
        sessionId,
        userId,
        documentName: file.name,
      });
      message.success("File uploaded successfully");
      setUploadResponse(res);
      useProgressTrackerStore.getState().updateStepStatus(ProgressStepKey.Upload, ProgressStepStatus.Completed);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      useProgressTrackerStore.getState().updateStepStatus(ProgressStepKey.Upload, ProgressStepStatus.Error);
      message.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const validateDocument = async (docTypeId: number) => {
    try {
      setIsDocTypeDisabled(true);
      useProgressTrackerStore.getState().updateStepStatus(ProgressStepKey.DocumentValidation, ProgressStepStatus.InProgress);
      const summary: DocumentSummary | null = await useDocumentSummaryStore.getState().getSummary(docTypeId);

      setValidationResponse(summary);
      useProgressTrackerStore.getState().updateStepStatus(ProgressStepKey.DocumentValidation, ProgressStepStatus.Completed);
      if (!summary?.is_valid_document) {
        setShowValidationWarning(true);
      } else {
        finalizeSummarization();
      }
    } catch (err) {
      message.error("Validation failed. Please try again.");
      setIsDocTypeDisabled(false);
      useProgressTrackerStore.getState().updateStepStatus(ProgressStepKey.DocumentValidation, ProgressStepStatus.Error);
    } 
  };

  const finalizeSummarization = () => {
    setSummaryRequested(true);
    setProceedClicked(false);
  };

  const proceedWithSummarization = async () => {
    if (!selectedDocType) return;
    setProceedClicked(true);
    await validateDocument(selectedDocType.doc_type_id);
  };

  const props: UploadProps = {
    multiple: false,
    beforeUpload: (file) => {
      setUploadedFile(file);
      handleUpload(file);
      return false;
    },
    showUploadList: false,
    accept: ".pdf,.docx",
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
            <CloudUploadOutlined style={{ fontSize: "2.5rem", color: "#9ca3af", marginBottom: "0.5rem" }} />
            <p className="ant-upload-text text-base font-medium">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint text-gray-500 text-sm">
              Supported formats: .pdf, .docx
            </p>
          </Dragger>
        </div>

        <div>
          {isUploading && (
            <div className="text-center mt-6 flex items-center space-x-3">
              <Spin />
              <span className="text-sm text-gray-700">Uploading document... Please wait</span>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center mt-4">
              <Text type="danger">{error}</Text>
            </div>
          )}
        </div>

        {!isUploading && uploadedFile && (
          <div className="w-full px-6 flex flex-col items-center gap-6">
            <DocumentTypeSelector
              onSelect={setSelectedDocType}
              isDocTypeDisabled={isDocTypeDisabled}
            />

            {selectedDocType && (
              <>
                <AssessmentsSection documentType={selectedDocType} />
                <div className="mt-4">
                  <Button type="primary" ghost onClick={proceedWithSummarization} loading={proceedClicked}>
                    Proceed with Analysis
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Modal
        open={showValidationWarning}
        title="Document Validation Warning"
        onOk={() => {
          setShowValidationWarning(false);
          finalizeSummarization();
        }}
        onCancel={() => {
          setIsDocTypeDisabled(false);
          setProceedClicked(false);
          setShowValidationWarning(false);
        }}
        okText="Proceed"
        cancelText="Cancel"
        centered
      >
        <p>{validationResponse?.doc_valid_status_msg || "This document has issues. Do you want to proceed?"}</p>
      </Modal>
    </Card>
  );
}
