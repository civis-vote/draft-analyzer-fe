import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Button, Spin, message } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDocumentStore } from "@/store/documentStore";
import { fetchScoreAnalysis } from "@/services/documentService";
import { ScoreAnalysisResponse } from "@/model/ScoreAnalysisModels";

const { Paragraph, Text } = Typography;

const pieColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A9A9F5"];

const ScoreAnalysis: React.FC = () => {
  const fileName = useDocumentStore((state) => state.uploadResponse?.file_name);
  const docId = useDocumentStore((state) => state.uploadResponse?.doc_id);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScoreAnalysisResponse | null>(null);

  useEffect(() => {
    if (!fileName || !docId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchScoreAnalysis({ docId });
        setData(response);
      } catch (err) {
        message.error("Failed to fetch score analysis.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fileName]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin tip="Loading score analysis..." size="large" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card className="shadow-lg rounded-2xl p-6 mx-auto mt-8 mb-16">
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Text strong style={{ fontSize: "24px", color: "#1890ff" }}>
              {data.overallScore}
            </Text>
            <Paragraph>Overall Score</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Text strong style={{ fontSize: "24px", color: "#1890ff" }}>
              {data.clarityRating}
            </Text>
            <Paragraph>Clarity Rating</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Text strong style={{ fontSize: "24px", color: "#1890ff" }}>
              {data.implementationDetail}
            </Text>
            <Paragraph>Implementation Detail</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Text strong style={{ fontSize: "24px", color: "#1890ff" }}>
              {data.stakeholderEngagement}
            </Text>
            <Paragraph>Stakeholder Engagement</Paragraph>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} md={12}>
          <Card title="Policy Element Scores">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.policyElementScores}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {data.policyElementScores.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Performance by Category">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.performanceByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "16px",
        }}
      >
        <Button type="primary" ghost>
          Download Results
        </Button>
      </div>
    </Card>
  );
};

export default ScoreAnalysis;
