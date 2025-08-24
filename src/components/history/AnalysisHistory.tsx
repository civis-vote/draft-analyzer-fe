import React, { useCallback, useEffect, useState } from 'react';
import { List, Card, Typography, Space, Spin, Alert, Empty, Button, Tag, message } from 'antd';
import { FileTextOutlined, CalendarOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';

import AnalysisModal from './AnalysisModal';
import { useAuthStore } from '@/store/authStore';
import { DocumentHistory } from '@/model/HistoryModel';
import { getUserHistory } from '@/services/HistoryService';

import { downloadSummaryReport } from '@/services/documentService';
import { formatDateTime, getStatusColor } from '@/utils/documentUtils';

const { Text, } = Typography;

const AnalysisHistory: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentHistory | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const { user } = useAuthStore();

  // Transform HistoryItem to HistoryDocument format with all required properties
  const transformToHistoryDocument = useCallback((item: DocumentHistory): DocumentHistory => ({
    doc_type_id: item.doc_type_id,
    doc_summary_id: item.doc_summary_id,
    file_name: item.file_name,
    summary_time: item.summary_time,
    status: item.status,
    doc_type: item.doc_type,
  }), []);

  const fetchHistory = useCallback(async () => {
    if (!user?.id) {
      setError('User authentication required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await getUserHistory(user.id);
      setDocuments(response.history || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load document history';
      setError(errorMessage);
      console.error('Failed to fetch user history:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDocumentClick = useCallback((item: DocumentHistory, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('.download-button')) {
      return;
    }
    
    const transformedDocument = transformToHistoryDocument(item);
    setSelectedDocument(transformedDocument);
    setModalVisible(true);
  }, [transformToHistoryDocument]);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setSelectedDocument(null);
  }, []);

  const handleDownload = useCallback(async (item: DocumentHistory, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setDownloadingId(item.doc_summary_id);
    
    try {
      await downloadSummaryReport(item.doc_summary_id);
      message.success('Summary report downloaded successfully');
    } catch (error) {
      message.error('Failed to download summary report');
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const renderDocumentItem = useCallback((item: DocumentHistory) => {
    const { formatted, relative } = formatDateTime(item.summary_time);
    const transformedDoc = transformToHistoryDocument(item);
    
    return (
      <List.Item className="px-0">
        <Card 
          hoverable
          onClick={(e) => handleDocumentClick(item, e)}
          className="w-full shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
          styles={{ body: { padding: '20px 24px' } }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                <FileTextOutlined className="text-xl text-blue-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <Text 
                    strong 
                    className="text-lg text-gray-900 truncate"
                    title={item.file_name}
                  >
                    {item.file_name}
                  </Text>                  
                </div>
                
                <div className="flex items-center space-x-4 mb-2">                  
                  <Tag color='purple' className="text-xs">
                    {transformedDoc.doc_type.toUpperCase()}
                  </Tag>
                  <Tag color={transformedDoc.status ? getStatusColor(transformedDoc.status) : 'default'} className="text-xs">
                    {transformedDoc.status?.toUpperCase()}
                  </Tag>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Space size={4} className="text-gray-500">
                    <CalendarOutlined className="text-sm" />
                    <Text type="secondary" className="text-sm">
                      {formatted}
                    </Text>
                  </Space>
                  
                  {relative && (
                    <Text type="secondary" className="text-xs text-gray-400">
                      {relative}
                    </Text>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={(e) => handleDownload(item, e)}
                loading={downloadingId === item.doc_summary_id}
                className="download-button flex items-center justify-center"
                title="Download document"
              >
                Download
              </Button>
              
              <div className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
                <EyeOutlined className="text-gray-400 text-sm" />
              </div>
            </div>
          </div>
        </Card>
      </List.Item>
    );
  }, [handleDocumentClick, handleDownload, downloadingId, transformToHistoryDocument]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spin size="large" />
        <Text type="secondary" className="mt-4">
          Loading your document history...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Alert
          message="Unable to Load History"
          description={error}
          type="error"
          showIcon
          action={
            <button
              onClick={fetchHistory}
              className="text-sm text-red-600 hover:text-red-700 underline"
            >
              Try Again
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text type="secondary" className="text-base">
                  No documents analyzed yet
                </Text>
                <br />
                <Text type="secondary" className="text-sm">
                  Upload your first document to get started
                </Text>
              </div>
            }
          />
        </div>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={documents}
          className="w-full"
          split={false}
          renderItem={renderDocumentItem}
        />
      )}

      <AnalysisModal
        document_history={selectedDocument}
        visible={modalVisible}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default AnalysisHistory;
