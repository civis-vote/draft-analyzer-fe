import AssessmentFramework from "./AssessmentFramework";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { DocumentType } from "@/model/DocumentModels";
import { useAssessmentAreaStore } from "@/store/assessmentAreaStore";
import { Card, message } from "antd";
import { useEffect } from "react";

const AssessmentModal: React.FC<{ documentType: DocumentType }> = ({
  documentType,
}) => {
  const { assessmentAreas, fetchAssessmentAreas, getAssessmentAreaById } =
    useAssessmentAreaStore();

  // Fetch assessment areas on mount
  useEffect(() => {
    if (assessmentAreas.length === 0) {
      fetchAssessmentAreas().catch(() => {
        message.error("Failed to load assessment areas");
      });
    }
  }, []);

  return (
    <Card className="w-full max-w-5xl mx-auto mt-4 shadow-lg rounded-xl">
      <div className="text-center">
        <Title level={3} style={{ margin: 0, color: "#1f2937" }}>
          Assessment Framework for {documentType.doc_type_name}
        </Title>
        <Paragraph type="secondary">
          This framework outlines the key assessments for the{" "}
          {documentType.doc_type_name} document type.
        </Paragraph>
      </div>
      {(documentType.assessment_ids ?? []).map((item, index) => {
        const assessment = getAssessmentAreaById(item);
        return assessment ? (
          <AssessmentFramework
            key={index}
            assessment={assessment}
            index={index + 1}
          />
        ) : null;
      })}
    </Card>
  );
};

export default AssessmentModal;
