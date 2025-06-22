import { Prompt } from '@/model/PromptModel';
import {
  getPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt,
} from '@/services/prompt-dashboard/promptService';
import { create } from 'zustand';

interface PromptStore {
  prompts: Prompt[];
  promptsLoading: boolean;
  promptsError: string | null;

  fetchPrompts: () => Promise<void>;
  addPrompt: (prompt: Prompt) => Promise<void>;
  updatePromptById: (prompt: Prompt) => Promise<void>;
  deletePromptById: (id: number) => Promise<void>;
  getPromptById(prompt_id: number): Prompt | undefined;
}

export const usePromptStore = create<PromptStore>((set, get) => ({
  prompts: [],
  promptsLoading: false,
  promptsError: null,

  fetchPrompts: async () => {
    set({ promptsLoading: true, promptsError: null });
    try {
      const data = await getPrompts();
      set({ prompts: data });
    } catch (err) {
      set({ promptsError: 'Failed to fetch prompts' });
    } finally {
      set({ promptsLoading: false });
    }
  },

  addPrompt: async (prompt) => {
    const created = await createPrompt(prompt);
    set((state) => ({
      prompts: [...state.prompts, created],
    }));
  },

  updatePromptById: async (prompt) => {
    const updated = await updatePrompt(prompt);
    set((state) => ({
      prompts: state.prompts.map((p) =>
        p.prompt_id === updated.prompt_id ? updated : p
      ),
    }));
  },

  deletePromptById: async (id) => {
    await deletePrompt(id);
    set((state) => ({
      prompts: state.prompts.filter((p) => p.prompt_id !== id),
    }));
  },

  getPromptById: (id: number) => {
    return get().prompts.find((p) => p.prompt_id === id);
  },

}));
