import React, { useState, useEffect } from 'react';
import { Spin, Space, Card, Typography, Tag, message } from 'antd';
import { AssessmentAreaEvaluation } from '@/model/documentModels';
import { useAssessmentEvaluationStore } from '@/store/assessmentEvaluationStore';
import { useAssessmentAreaStore } from '@/store/assessmentAreaStore';

const { Paragraph } = Typography;

interface Props {
  doc_summary_id: number,
  assessment_id: number
};

const getScoreTagColor = (score: number | undefined) => {
  if (score === undefined) return;
  if (score >= 8) return "green";
  if (score >= 6) return "orange";
  return "red";
};

const AssessmentAreaCard: React.FC<Props> = ({doc_summary_id, assessment_id}) => {
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<AssessmentAreaEvaluation>();
  const [description, setDescription] = useState<string>();
  const fetchAndSetAssessmentEvaluation = useAssessmentEvaluationStore((state) => state.fetchAndSetAssessmentEvaluation);
  const setEvaluationError = useAssessmentEvaluationStore((state) => state.setEvaluationError);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const assessment_area = useAssessmentAreaStore.getState().assessmentAreas.filter(
        (area) => area.assessment_id == assessment_id
      )[0];
      setDescription(assessment_area.description)
      try {
        const eval_response = await fetchAndSetAssessmentEvaluation(doc_summary_id, assessment_id);
        setEvaluation(eval_response);
      } catch (err) {
        setEvaluationError(assessment_id, err);
        message.error(`Failed to fetch evaluation for assessment_id ${assessment_id}`)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doc_summary_id, assessment_id]);

  return(
    <>
      {loading ? (
        <div className="flex justify-center py-8">
          <Spin tip="Loading evaluations..." size="large" />
        </div>
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Card
            type="inner"
            key={assessment_id}
            style={{
              backgroundColor: "#fafafa",
              borderLeft: "4px solid #1890ff",
            }}
          >
            <Paragraph strong style={{ color: "#1890ff", marginBottom: 4 }}>
              {description}
            </Paragraph>
            <Paragraph>{evaluation?.summary}</Paragraph>
            <Tag
              color={getScoreTagColor(evaluation?.overall_score)}
              style={{ fontSize: "14px" }}
            >
              {evaluation?.overall_score} / 10
            </Tag>
          </Card>
        </Space>
      )}
    </> 
  );
};

export default AssessmentAreaCard;
