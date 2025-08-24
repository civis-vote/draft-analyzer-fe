import { SummaryState } from "@/model/HistoryModel";
import { FileTextOutlined } from "@ant-design/icons";
import { Card, Spin, Alert } from "antd";
import Title from "antd/es/typography/Title";

const SummaryCard: React.FC<{
    title: string;
    summaryState: SummaryState;
  }> = ({ title, summaryState }) => (
    <div style={{ marginTop: 24 }}>
      <Title level={4}>
        <FileTextOutlined style={{ marginRight: 8 }} />
        {title}
      </Title>

      <Card
        size="small"
        style={{
          marginTop: 16,
          background: "#f9f9f9",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
        }}
      >
        {summaryState.loading ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Loading {title.toLowerCase()}...</div>
          </div>
        ) : summaryState.error ? (
          <Alert
            message="Error"
            description={summaryState.error}
            type="error"
            showIcon
          />
        ) : summaryState.text ? (
          <div
            className="prose prose-base max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: summaryState.text }}
          />
        ) : (
          <div style={{ color: '#999', fontStyle: 'italic' }}>
            No content available
          </div>
        )}
      </Card>
    </div>
  );

  export default SummaryCard;