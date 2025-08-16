import React from 'react';
import { Modal } from 'antd';
import InsightSection from '../upload-section/evaluation/InsightSection';
import EvaluationSection from '../upload-section/assessment-evaluation/EvaluationSection';
import ScoreAnalysis from '../upload-section/evaluation/ScoreAnalysis';
import { type HistoryDocument } from '@/store/historyStore';

interface AnalysisModalProps {
  document: HistoryDocument | null;
  visible: boolean;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ 
  document, 
  visible, 
  onClose 
}) => {
  if (!document) return null;

  return (
    <Modal
      title={`Document Analysis - ${document.fileName}`}
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <div className="max-h-[80vh] overflow-y-auto">
        <InsightSection />
        <EvaluationSection />
        <ScoreAnalysis />
      </div>
    </Modal>
  );
};

export default AnalysisModal;
