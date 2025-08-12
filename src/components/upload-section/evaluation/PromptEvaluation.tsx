import React, { useEffect, useState } from "react";
import { Card, Typography } from "antd";
// import { EvaluationItem } from "@/model/EvaluationModels";
import { useDocumentStore, useDocumentTypeStore } from "@/store/documentStore";
import { useProgressTrackerStore } from "@/store/progressTrackerStore";
import { useDocumentSummaryStore } from "@/store/documentSummaryStore";
import { useAssessmentEvaluationStore } from "@/store/assessmentEvaluationStore";
import { ProgressStepStatus } from "../../../constants/ProgressStatus";
import { ProgressStepKey } from "../../../constants/ProgressStepKey";
import { AssessmentAreaEvaluation } from "@/model/documentModels";
import AssessmentAreaCard from "../assessment-evaluation/AssessmentAreaCard";

const { Title, Paragraph } = Typography;

// const getScoreTagColor = (score: number) => {
//   if (score >= 8) return "green";
//   if (score >= 6) return "orange";
//   return "red";
// };

const getSize = (obj: Map<number, AssessmentAreaEvaluation> | object) => {
  if (obj instanceof Map) {
    return obj.size;
  } else {
    return Object.keys(obj).length;
  }
};

const PromptEvaluation: React.FC = () => {
  const summaryRequested = useDocumentStore((state) => state.summaryRequested);
  // const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  // const [loading, setLoading] = useState(false);
  const [docSummaryId, setDocSummaryId] = useState(0);
  const [assessmentIds, setAssessmentIds] = useState([]);
  const updateStepStatus = useProgressTrackerStore((state) => state.updateStepStatus);
  // const fetchAndSetAssessmentEvaluations = useAssessmentEvaluationStore((state) => state.fetchAndSetAssessmentEvaluations);
  const evaluations = useAssessmentEvaluationStore.getState().evaluations;
  const evaluationsError = useAssessmentEvaluationStore.getState().evluationsError;

  useEffect(() => {
    const setStates = () => {
      if (!summaryRequested) return;
      // setLoading(true);
      updateStepStatus(ProgressStepKey.Evaluate, ProgressStepStatus.InProgress);
      const summary = useDocumentSummaryStore.getState().summary;
      setDocSummaryId(summary.doc_summary_id);
      const document_type = useDocumentTypeStore.getState().documentTypes.filter(
        (type) => type.doc_type_id == summary.doc_type_id
      )[0];
      setAssessmentIds(document_type.assessment_ids);
      // try {
      //   const evaluations = fetchAndSetAssessmentEvaluations(summary.doc_summary_id, document_type.assessment_ids);
      //   setEvaluations(evaluations);
      //   updateStepStatus(ProgressStepKey.Evaluate, ProgressStepStatus.Completed);
      // } catch (err) {
      //   message.error("Failed to fetch evaluations.");
      //   updateStepStatus(ProgressStepKey.Evaluate, ProgressStepStatus.Error);
      // } finally {
      //   setLoading(false);
      // }
    };

    setStates();
  }, [summaryRequested, updateStepStatus]);

  useEffect(() => {
    if (getSize(evaluationsError) > 0) {
      updateStepStatus(ProgressStepKey.Evaluate, ProgressStepStatus.Error);
    } else if (getSize(evaluations) + getSize(evaluationsError) === assessmentIds.length) {
      updateStepStatus(ProgressStepKey.Evaluate, ProgressStepStatus.Completed);
    }
  }, [evaluations, evaluationsError]);

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

      {/* {loading ? (
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
      )} */}
      {assessmentIds.map((assessment_id) => (
        <AssessmentAreaCard doc_summary_id={docSummaryId} assessment_id={assessment_id}/>
      ))}
    </Card>
  );
};

export default PromptEvaluation;
