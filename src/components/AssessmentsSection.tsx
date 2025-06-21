import React, { useEffect, useState } from 'react';
import AssessmentFramework from './AssessmentFramework';
import { getAssessmentsByDocumentType } from '@/services/documentService';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import { Card } from 'antd';
import { Assessment, DocumentType } from '@/model/DocumentModels';

const AssessmentModal: React.FC<{ documentType: DocumentType }> = ({ documentType }) => {
  const [assessmentData, setAssessmentData] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await getAssessmentsByDocumentType(documentType.doc_type_id);
        setAssessmentData(data);
      } catch (err) {
        setError('Failed to fetch assessments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [documentType.doc_type_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card className="w-full max-w-5xl mx-auto mt-4 shadow-lg rounded-xl">
      <div className="text-center">
        <Title level={3} style={{ margin: 0, color: "#1f2937" }}>
          Assessment Framework for {documentType.doc_type_name}
        </Title>
        <Paragraph type="secondary">
          This framework outlines the key assessments for the {documentType.doc_type_name} document type.
        </Paragraph>
      </div>
      {assessmentData.map((item, index) => (
        <AssessmentFramework key={index} assessment={item} index={index + 1} />
      ))}
    </Card>
  );
};

export default AssessmentModal;
