import { Modal, Input, Button, Card, Checkbox } from 'antd';
import { useEffect, useState } from 'react';
import { AssessmentArea } from '@/model/AssessmentAreaModel';
import { usePromptStore } from '@/store/promptStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (area: AssessmentArea) => void;
  mode: 'add' | 'edit';
  initialData?: AssessmentArea;
}

const AssessmentAreaForm: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  mode,
  initialData,
}) => {
  const [formData, setFormData] = useState<AssessmentArea>({
    assessment_id: 0,
    assessment_name: '',
    description: '',
    created_by: '',
    created_on: '',
    updated_by: '',
    updated_on: '',
    prompt_ids: [],
  });
    const {
      prompts,
      fetchPrompts,
    } = usePromptStore();
  
    // Fetch prompts on mount
    useEffect(() => {
      if (prompts.length === 0) {
        fetchPrompts().catch((error) => {
          console.error('Failed to fetch prompts:', error);
        });
      }
    }, []);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        assessment_name: '',
        description: '',
        created_by: '',
        updated_by: '',
        prompt_ids: [],
      } as AssessmentArea);
    }
  }, [mode, initialData]);
  
  const handleChange = (field: keyof AssessmentArea, value: string | number[]) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      open={visible}
      title={mode === 'edit' ? 'Edit Assessment Area' : 'Add New Assessment Area'}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="space-y-5">
        <div>
          <label className="block font-medium">Assessment Name</label>
          <Input
            value={formData.assessment_name}
            onChange={(e) => handleChange('assessment_name', e.target.value)}
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
          <label className="block font-medium">Created By</label>
          <Input
            value={formData.created_by}
            onChange={(e) => handleChange('created_by', e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Updated By</label>
          <Input
            value={formData.updated_by}
            onChange={(e) => handleChange('updated_by', e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Link Prompts</label>
          <Card className="border rounded-lg p-4 max-h-48 overflow-y-auto">
            <Checkbox.Group
              value={formData.prompt_ids || []}
              onChange={(val) => handleChange('prompt_ids', val)}
            >
              <div className="flex flex-col gap-2">
                {prompts.map((prompt) => (
                  <Checkbox key={prompt.prompt_id} value={prompt.prompt_id}>
                    {prompt.question}
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

export default AssessmentAreaForm;
