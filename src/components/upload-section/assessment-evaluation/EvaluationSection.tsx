import React, { useMemo } from "react";
import { Card, Typography } from "antd";
import AssessmentAreaCard from "./AssessmentAreaCard";
import { useDocumentStore, useDocumentTypeStore } from "@/store/documentStore";
import { useAssessmentAreaStore } from "@/store/assessmentAreaStore";
import { useDocumentSummaryStore } from "@/store/documentSummaryStore";
import { useProgressTrackerStore } from "@/store/progressTrackerStore";
import { ProgressStepStatus } from "@/constants/ProgressStatus";
import { ProgressStepKey } from "@/constants/ProgressStepKey";
import { useAssessmentEvaluationStore } from "@/store/assessmentEvaluationStore";

const { Title, Paragraph } = Typography;

const EvaluationSection: React.FC = () => {
  const summaryRequested = useDocumentStore((state) => state.summaryRequested);
  const { assessmentAreas } = useAssessmentAreaStore();
  const { doc_summary_id = null, doc_type_id = null } =
    useDocumentSummaryStore((state) => state.summary ?? {
      doc_summary_id: null,
      doc_type_id: null,
    });
  const documentTypes = useDocumentTypeStore((state) => state.documentTypes);
  const updateStepStatus = useProgressTrackerStore(
    (state) => state.updateStepStatus
  );

  const documentType = useMemo(
    () =>
      doc_type_id
        ? documentTypes.find((type) => type.doc_type_id === doc_type_id)
        : undefined,
    [documentTypes, doc_type_id]
  );

  const evaluations = useAssessmentEvaluationStore().evaluations;

  const isEvaluationComplete =
    !!documentType?.assessment_ids?.length &&
    documentType.assessment_ids.every(
      (id) => evaluations && (evaluations as Record<number, any>)[id]
    );

  if (!summaryRequested || !doc_summary_id || !documentType?.assessment_ids?.length) {
    return null;
  }

  if (!isEvaluationComplete) {
    updateStepStatus(ProgressStepKey.Evaluate, ProgressStepStatus.InProgress);
  }

  return (
    <Card className="shadow-lg rounded-2xl p-6 mx-auto mt-8 mb-16">
      <Title level={3} className="text-center">
        Document Evaluation by Assessment Areas
      </Title>
      <Paragraph type="secondary" className="text-center mb-6">
        View the summary and score for uploaded policy document as per
        assessment areas.
      </Paragraph>

      {documentType.assessment_ids.map((assessmentId) => {
        const assessmentArea = assessmentAreas.find(
          (area) => area.assessment_id === assessmentId
        );
        if (!assessmentArea?.assessment_id) return null;

        return (
          <AssessmentAreaCard
            key={assessmentArea.assessment_id}
            doc_summary_id={doc_summary_id}
            assessment_id={assessmentArea.assessment_id}
          />
        );
      })}
    </Card>
  );
};

export default EvaluationSection;
