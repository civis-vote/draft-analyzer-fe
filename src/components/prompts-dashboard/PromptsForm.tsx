import { Modal, Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import { Prompt } from '@/model/PromptModel';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (prompt: Prompt) => void;
  mode: 'add' | 'edit';
  initialData?: Prompt;
}

const PromptsForm: React.FC<Props> = ({ visible, onClose, onSubmit, mode, initialData }) => {
  const [formData, setFormData] = useState<Prompt>({
    prompt_id: 0,
    criteria: '',
    question: '',
    created_by: '',
  });

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
    } else {
      setFormData({ criteria: '', question: '', created_by: '' });
    }
  }, [mode, initialData]);

  const handleChange = (field: keyof Prompt, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      open={visible}
      title={mode === 'edit' ? 'Edit Prompt' : 'Add New Prompt'}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="space-y-5">
        <div>
          <label className="block font-medium">Criteria</label>
          <Input value={formData.criteria} onChange={(e) => handleChange('criteria', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Question</label>
          <Input.TextArea
            rows={4}
            value={formData.question}
            onChange={(e) => handleChange('question', e.target.value)}
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

export default PromptsForm;