import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  message,
} from "antd";
import {
  FileTextOutlined,
} from "@ant-design/icons";
import { SummaryResponse } from "@/model/DocumentModels";
import { useDocumentSummaryStore } from "@/store/documentSummaryStore";
import { useDocumentStore } from "@/store/documentStore";
import { ProgressStepKey } from "@/constants/ProgressStepKey";
import { ProgressStepStatus } from "@/constants/ProgressStatus";
import { useProgressTrackerStore } from "@/store/progressTrackerStore";

const { Title, Paragraph } = Typography;

const InsightSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const updateStepStatus = useProgressTrackerStore((state) => state.updateStepStatus);
  const fetchAndSetSummaryText = useDocumentSummaryStore((state) => state.fetchAndSetSummaryText);

  
  const summaryRequested = useDocumentStore((state) => state.summaryRequested);
  const summary = useDocumentSummaryStore((state) => state.summary);

  useEffect(() => {
    const getSummary = async () => {

      if (!summaryRequested || !summary?.doc_summary_id) {
        return;
      }

      setLoading(true);
      updateStepStatus(ProgressStepKey.Summarize, ProgressStepStatus.InProgress);
      try {
        console.log("Fetching summary for doc_summary_id:", summary.doc_summary_id);
        const response = await fetchAndSetSummaryText(summary.doc_summary_id);
        setSummaryData(response);
        updateStepStatus(ProgressStepKey.Summarize, ProgressStepStatus.Completed);

      } catch (err) {
        console.error("Failed to fetch summary:", err);
        message.error("Failed to fetch summary.");
      } finally {
        setLoading(false);
      }
    };

    getSummary();
  }, [summaryRequested, summary?.doc_summary_id, fetchAndSetSummaryText]);

  return (
    <Card className="shadow-lg rounded-2xl p-6 mx-auto mt-8 mb-16">
      <div ref={summaryRef} style={{ padding: "1rem" }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Document Insights
        </Title>
        <Paragraph
          type="secondary"
          style={{
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto 24px",
          }}
        >
          Summary of your uploaded policy document
        </Paragraph>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spin tip="Loading summary..." size="large" />
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
            "Document summary is not available."
          </Paragraph>
        )}
      </div>
    </Card>
  );
};

export default InsightSection;
