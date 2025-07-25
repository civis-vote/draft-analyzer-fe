import React, { useEffect, useState } from "react";
import { Card, Typography, Tag, Space, Spin, message } from "antd";
import { EvaluationItem } from "@/model/EvaluationModels";
import { fetchPromptEvaluations } from "@/services/documentService";
import { useDocumentStore } from "@/store/documentStore";
import { useProgressTrackerStore } from "@/store/progressTrackerStore";
import { ProgressStepStatus } from "../constants/ProgressStatus";
import { ProgressStepKey } from "../constants/ProgressStepKey";

const { Title, Paragraph } = Typography;

const getScoreTagColor = (score: number) => {
  if (score >= 8) return "green";
  if (score >= 6) return "orange";
  return "red";
};

const PromptEvaluation: React.FC = () => {
  const fileName = useDocumentStore((state) => state.uploadResponse?.file_name);
  const docId = useDocumentStore((state) => state.uploadResponse?.doc_id);
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const updateStepStatus = useProgressTrackerStore((state) => state.updateStepStatus);

  useEffect(() => {
    const fetchData = async () => {
      if (!fileName || !docId) return;
      setLoading(true);
      updateStepStatus(ProgressStepKey.Evaluate, ProgressStepStatus.InProgress);
      try {
        const data = await fetchPromptEvaluations({ docId });
        setEvaluations(data.evaluations);
        updateStepStatus(ProgressStepKey.Evaluate, ProgressStepStatus.Completed);
      } catch (err) {
        message.error("Failed to fetch evaluations.");
        updateStepStatus(ProgressStepKey.Evaluate, ProgressStepStatus.Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [docId]);

  return (
    <Card className="shadow-lg rounded-2xl p-6 mx-auto mt-8 mb-16">
      <Title level={3} style={{ textAlign: "center" }}>
        Evaluation by Assessment Areas
      </Title>
      <Paragraph
        type="secondary"
        style={{ textAlign: "center", margin: "0 auto 24px" }}
      >
        View the answers and score for your uploaded policy documents using the
        predefined description.
      </Paragraph>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spin tip="Loading evaluations..." size="large" />
        </div>
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {evaluations.map((evalItem, index) => (
            <Card
              type="inner"
              key={index}
              style={{
                backgroundColor: "#fafafa",
                borderLeft: "4px solid #1890ff",
              }}
            >
              <Paragraph strong style={{ color: "#1890ff", marginBottom: 4 }}>
                {evalItem.description}
              </Paragraph>
              <Paragraph>{evalItem.answer}</Paragraph>
              <Tag
                color={getScoreTagColor(evalItem.score)}
                style={{ fontSize: "14px" }}
              >
                {evalItem.score}/10
              </Tag>
            </Card>
          ))}
        </Space>
      )}
    </Card>
  );
};

export default PromptEvaluation;
