import React, { useEffect, useMemo, useState } from "react";
import { Card, Spin, message, Progress, Row, Col } from "antd";
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
  ResponsiveContainer,
  LabelList,
  Legend,
} from "recharts";
import { fetchScoreAnalysis } from "@/services/documentService";
import { ScoreAnalysisResponse } from "@/model/ScoreAnalysisModels";
import { useProgressTrackerStore } from "@/store/progressTrackerStore";
import { ProgressStepStatus } from "../../../constants/ProgressStatus";
import { ProgressStepKey } from "../../../constants/ProgressStepKey";
import { useDocumentSummaryStore } from "@/store/documentSummaryStore";
import { aggregateData } from "@/utils/helpers";
import { useAssessmentEvaluationStore } from "@/store/assessmentEvaluationStore";
import { useDocumentTypeStore } from "@/store/documentStore";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

const pieColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A9A9F5"];

const ScoreAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScoreAnalysisResponse[] | null>(null);

  const updateStepStatus = useProgressTrackerStore((state) => state.updateStepStatus);
  const { doc_summary_id = null, doc_type_id = null } =
    useDocumentSummaryStore((state) => state.summary ?? {
      doc_summary_id: null,
      doc_type_id: null,
    });

  const { evaluations, evaluationsError } = useAssessmentEvaluationStore();

  const documentTypes = useDocumentTypeStore((state) => state.documentTypes);

  const documentType = useMemo(
    () =>
      doc_type_id
        ? documentTypes.find((type) => type.doc_type_id === doc_type_id)
        : undefined,
    [documentTypes, doc_type_id]
  );

  const isEvaluationComplete =
  !!documentType?.assessment_ids?.length &&
  documentType.assessment_ids.every(
    (id) =>
      evaluations &&
      //evaluationsError &&
      (
        (evaluations as Record<number, any>)[id] !== undefined 
        // || (evaluationsError as Record<number, any>)[id] !== undefined
      )
  );


  // Track evaluation progress status
  useEffect(() => {
    if (!documentType?.assessment_ids?.length) return;

    if (isEvaluationComplete) {
      updateStepStatus(ProgressStepKey.Evaluate, ProgressStepStatus.Completed);
    } else {
      updateStepStatus(ProgressStepKey.Evaluate, ProgressStepStatus.InProgress);
    }
  }, [isEvaluationComplete, documentType?.assessment_ids, updateStepStatus]);

  // Don’t even try loading scores until evaluation complete
  useEffect(() => {
    if (!doc_summary_id || !isEvaluationComplete) return;

    const loadData = async () => {
      setLoading(true);
      updateStepStatus(ProgressStepKey.Score, ProgressStepStatus.InProgress);
      try {
        const response = await fetchScoreAnalysis(doc_summary_id);
        setData(response);
        updateStepStatus(ProgressStepKey.Score, ProgressStepStatus.Completed);
      } catch (err) {
        message.error("Failed to fetch score analysis.");
        updateStepStatus(ProgressStepKey.Score, ProgressStepStatus.Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [doc_summary_id, isEvaluationComplete, updateStepStatus]);

  if (!isEvaluationComplete) {
    return null; // wait until all evaluations done
  }

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

  const aggregatedData = aggregateData(data);

  return (
    <Card className="shadow-lg rounded-2xl p-6 mx-auto mt-8 mb-16">
          <Title level={3} className="text-center">
            Score Analysis by Criteria
          </Title>
          <Paragraph type="secondary" className="text-center mb-6">
            View the score for uploaded policy document as per criteria.
          </Paragraph>
    
      {/* Score Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {aggregatedData.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.criteria}>
            <Card title={item.criteria} bordered bodyStyle={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: "#888" }}>Score</span>
                <span style={{ fontSize: 16, fontWeight: "bold" }}>
                  {item.Score} / {item.Max}
                </span>
              </div>
              <Progress
                percent={(item.Score / item.Max) * 100}
                showInfo={false}
                strokeColor="#1677ff"
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Score Overview (Bar Chart)" bordered={false}>
            <div style={{ height: 320, padding: "8px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={aggregatedData}
                  margin={{ top: 30, right: 40, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="criteria" />
                  <YAxis domain={[0, (dataMax: number) => Math.max(10, dataMax)]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Score" fill="#1677ff" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="Score" position="top" offset={10} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Score Distribution (Pie Chart)" bordered={false}>
            <div style={{ height: 320, padding: "8px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aggregatedData}
                    dataKey="Score"
                    nameKey="criteria"
                    outerRadius={100}
                    label
                  >
                    {aggregatedData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};
export default ScoreAnalysis;
