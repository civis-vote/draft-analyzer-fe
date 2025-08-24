import React, { useEffect, useState, useCallback } from 'react';
import { Modal } from 'antd';
import { DocumentHistory, ExecutiveSummary, SummaryState } from '@/model/HistoryModel';
import { generateExecutativeSummary, summarizeDocument } from '@/services/documentService';
import SummaryCard from './SummaryCard';

interface AnalysisModalProps {
  document_history: DocumentHistory | null;
  visible: boolean;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ 
  document_history, 
  visible, 
  onClose 
}) => {
  const [documentSummary, setDocumentSummary] = useState<SummaryState>({
    text: '',
    loading: false,
    error: null
  });
  
  const [executiveSummary, setExecutiveSummary] = useState<SummaryState>({
    text: '',
    loading: false,
    error: null
  });

  const fetchDocumentSummary = useCallback(async (doc_summary_id: number) => {
    if (!doc_summary_id) return;

    setDocumentSummary(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const doc_summary = await summarizeDocument(doc_summary_id);
      setDocumentSummary({
        text: doc_summary.summary_text || '',
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching document summary:', error);
      setDocumentSummary({
        text: '',
        loading: false,
        error: 'Failed to load document summary'
      });
    }
  }, []);

  const fetchExecutiveSummary = useCallback(async (doc_summary_id: number) => {
    if (!doc_summary_id) return;

    setExecutiveSummary(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const execSummary: ExecutiveSummary = await generateExecutativeSummary(doc_summary_id);
      setExecutiveSummary({
        text: execSummary.executive_summary_text || '',
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching executive summary:', error);
      setExecutiveSummary({
        text: '',
        loading: false,
        error: 'Failed to load executive summary'
      });
    }
  }, []);

  useEffect(() => {
    if (visible && document_history?.doc_summary_id) {
      // Reset state when modal opens with new document
      setDocumentSummary({ text: '', loading: false, error: null });
      setExecutiveSummary({ text: '', loading: false, error: null });
      
      // Fetch both summaries
      fetchDocumentSummary(document_history.doc_summary_id);
      fetchExecutiveSummary(document_history.doc_summary_id);
    }
  }, [visible, document_history?.doc_summary_id, fetchDocumentSummary, fetchExecutiveSummary]);

  // Early return if no document history
  if (!document_history) return null;

  return (
    <Modal
      title={`Document Analysis - ${document_history.file_name}`}
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={null}
      destroyOnClose // Clean up state when modal closes
    >
      <SummaryCard
        title="Document Summary" 
        summaryState={documentSummary} 
      />
      
      <SummaryCard 
        title="Executive Summary" 
        summaryState={executiveSummary} 
      />
    </Modal>
  );
};

export default AnalysisModal;
