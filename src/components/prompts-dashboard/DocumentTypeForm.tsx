import { Modal, Input, Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import { DocumentType } from '@/model/DocumentModels';
import { useAssessmentAreaStore } from '@/store/assessmentAreaStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (doc: DocumentType) => void;
  mode: 'add' | 'edit';
  initialData?: DocumentType;
}

const DocumentTypeForm: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  mode,
  initialData
}) => {
  const [formData, setFormData] = useState<DocumentType>({
    doc_type_id: 0,
    doc_type_name: '',
    description: '',
    updated_by: '',
    updated_on: '',
    assessment_ids: [],
  });
  const { assessmentAreas, fetchAssessmentAreas, assessmentAreasLoading } = useAssessmentAreaStore();
  const [assessmentOptions, setAssessmentOptions] = useState<{label: string, value: number}[]>([]);

  useEffect(() => {
    fetchAssessmentAreas();
  }, [fetchAssessmentAreas]);

  useEffect(() => {
    setAssessmentOptions(
      (assessmentAreas || []).map((area) => ({
        label: area.assessment_name || area.name || 'Unnamed',
        value: area.assessment_id as number,
      }))
    );
  }, [assessmentAreas]);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
    } else if (mode === 'add') {
      setFormData({
        doc_type_id: 0,
        doc_type_name: '',
        description: '',
        updated_by: '',
        updated_on: '',
        assessment_ids: [],
      });
    }
  }, [mode, initialData]);

  const handleChange = (field: keyof DocumentType, value: unknown) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      assessments: formData.assessment_ids || [],
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <Modal
      open={visible}
      title={mode === 'edit' ? 'Edit Document Type' : 'Add New Document Type'}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="space-y-5">
        <div>
          <label className="block font-medium">Document Type Name</label>
          <Input
            value={formData.doc_type_name}
            onChange={(e) => handleChange('doc_type_name', e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <Input.TextArea
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Link Assessment Areas</label>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder={assessmentAreasLoading ? 'Loading...' : 'Select assessment areas'}
            value={formData.assessment_ids}
            onChange={(val) => handleChange('assessment_ids', val)}
            options={assessmentOptions}
            loading={assessmentAreasLoading}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>
            {mode === 'edit' ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentTypeForm;
