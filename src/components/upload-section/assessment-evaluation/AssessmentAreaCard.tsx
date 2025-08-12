import React, { useState, useEffect } from 'react';
import { Spin, Space, Card, Typography, Tag, message } from 'antd';
import { AssessmentAreaEvaluation } from '@/model/documentModels';
import { usePromptEvaluationStore } from '@/store/promptEvaluationStore';

const { Paragraph } = Typography;

interface Props {
  doc_summary_id: number,
  assessment_id: number
};

const AssessmentAreaCard: React.FC<Props> = ({doc_summary_id, assessment_id}) => {
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<AssessmentAreaEvaluation>();
  const [description, setDescription] = useState();
  const fetchAndSetAssessmentEvaluation = usePromptEvaluationStore((state) => state.fetchAndSetAssessmentEvaluation);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // get and set description for assessment area (should be available in some store)
      
      try {
        const eval_response = await fetchAndSetAssessmentEvaluation(doc_summary_id, assessment_id);
        setEvaluation(eval_response);
      } catch (err) {
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
            <Paragraph>{evaluation.summary}</Paragraph>
            <Tag
              style={{ fontSize: "14px" }}
            >
              {evaluation.overall_score}
            </Tag>
          </Card>
        </Space>
      )}
    </> 
  );
};

export default AssessmentAreaCard;
