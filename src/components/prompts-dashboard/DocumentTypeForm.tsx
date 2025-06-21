import { Modal, Input, Button, Card, Checkbox } from 'antd';
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
    created_by: 'Admin',
    created_on: '',
    updated_by: '',
    updated_on: '',
    assessment_ids: [],
  });

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
    } else if (mode === 'add') {
      setFormData({
        doc_type_id: 0,
        doc_type_name: '',
        description: '',
        created_by: 'Admin',
        created_on: '',
        updated_by: '',
        updated_on: '',
        assessment_ids: [],
      });
    }
  }, [mode, initialData]);

  const {
      assessmentAreas,
      fetchAssessmentAreas,
    } = useAssessmentAreaStore();
  
    // Fetch assessment areas on mount
    useEffect(() => {
      if (assessmentAreas.length === 0) {
        fetchAssessmentAreas().catch((error) => {
          console.error("Failed to load assessment areas:", error);
        });
      }
    }, []);

  const handleChange = (field: keyof DocumentType, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
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
        <Card className="border rounded-lg p-4 max-h-48 overflow-y-auto">
          <Checkbox.Group
            value={formData.assessment_ids || []}
            onChange={(val) => handleChange('assessment_ids', val)}
          >
            <div className="flex flex-col gap-2">
              {assessmentAreas.map((area) => (
                <Checkbox key={area.assessment_id} value={area.assessment_id}>
                  {area.assessment_name}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Card>
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
