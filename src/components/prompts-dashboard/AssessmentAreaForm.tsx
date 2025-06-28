import { Modal, Input, Button, Select } from 'antd';
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
    created_on: '',
    updated_on: '',
    prompt_ids: [],
  });
  const { prompts, fetchPrompts } = usePromptStore();
  const [promptOptions, setPromptOptions] = useState<{label: string, value: number}[]>([]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  useEffect(() => {
    setPromptOptions(
      (prompts || [])
        .filter((prompt) => typeof prompt.prompt_id === 'number')
        .map((prompt) => ({
          label: prompt.question || 'Unnamed',
          value: prompt.prompt_id as number,
        }))
    );
  }, [prompts]);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        assessment_name: '',
        description: '',
        created_on: '',
        updated_on: '',
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
          <label className="block font-medium mb-2">Link Prompts</label>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder={'Select prompts'}
            value={formData.prompt_ids || []}
            onChange={(val) => handleChange('prompt_ids', val)}
            options={promptOptions}
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

export default AssessmentAreaForm;
