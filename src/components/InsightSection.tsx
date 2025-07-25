import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Spin,
  message,
} from "antd";
import {
  FileTextOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { summarizeDocument } from "@/services/documentService";
import { useDocumentStore } from "@/store/documentStore";
import { SummaryResponse } from "@/model/DocumentModels";
import { useProgressTrackerStore } from "@/store/progressTrackerStore";
import { ProgressStepStatus } from "../constants/ProgressStatus";
import { ProgressStepKey } from "../constants/ProgressStepKey";

const { Title, Paragraph } = Typography;

const InsightSection: React.FC = () => {
  const fileName = useDocumentStore((state) => state.uploadResponse?.file_name);
  const docId = useDocumentStore((state) => state.uploadResponse?.doc_id);
  const summaryRequested = useDocumentStore((state) => state.summaryRequested);

  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const updateStepStatus = useProgressTrackerStore((state) => state.updateStepStatus);

  useEffect(() => {
    const getSummary = async () => {
      if (!summaryRequested || !fileName) return;
      updateStepStatus(ProgressStepKey.Summarize, ProgressStepStatus.InProgress);
      setLoading(true);
      try {
        if (!docId) {
          message.error("Document upload ID is missing.");
          setLoading(false);
          return;
        }
        const response = await summarizeDocument({ doc_id: docId });
        setSummaryData(response);
        updateStepStatus(ProgressStepKey.Summarize, ProgressStepStatus.Completed);
      } catch (err) {
        message.error("Failed to fetch summary.");
        updateStepStatus(ProgressStepKey.Summarize, ProgressStepStatus.Error);
      } finally {
        setLoading(false);
      }
    };

    getSummary();
  }, [summaryRequested, fileName, updateStepStatus]);

  const handleDownloadPDF = async () => {
    if (!summaryRef.current) return;
    const canvas = await html2canvas(summaryRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("policy_summary.pdf");
  };

  return (
    <Card className="shadow-lg rounded-2xl p-6 mx-auto mt-8 mb-16">
      <div ref={summaryRef} style={{ padding: "1rem" }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Get Your Document Insights
        </Title>
        <Paragraph
          type="secondary"
          style={{
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto 24px",
          }}
        >
          Easily view the summary of your uploaded policy documents.
        </Paragraph>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spin tip="Generating summary..." size="large" />
          </div>
        ) : summaryData ? (
          <div style={{ marginTop: 24 }}>
            <Title level={4}>
              <FileTextOutlined style={{ marginRight: 8 }} />
              Document Summary
            </Title>

            <Card
              size="small"
              style={{
                marginTop: 24,
                background: "#f9f9f9",
                border: "1px solid #f0f0f0",
                borderRadius: 8,
              }}
            >
              <div
                className="prose prose-base max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: summaryData.summary_text }}
              />
            </Card>
          </div>
        ) : (
          <Paragraph style={{ textAlign: "center", marginTop: 32 }}>
            Upload a document and click summarize to view the summary here.
          </Paragraph>
        )}
      </div>

      {summaryData && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            ghost
            onClick={handleDownloadPDF}
          >
            Download Summary
          </Button>
        </div>
      )}
    </Card>
  );
};

export default InsightSection;
