import axios from 'axios';
import { Prompt } from '@/model/PromptModel';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getPrompts = async (): Promise<Prompt[]> => {
  const response = await axios.get(`${BASE_URL}/prompt`);
  return response.data;
};

export const createPrompt = async (prompt: Partial<Prompt>): Promise<Prompt> => {
  const response = await axios.post(`${BASE_URL}/prompt`, prompt);
  return response.data;
};

export const updatePrompt = async (prompt: Partial<Prompt>): Promise<Prompt> => {
  const response = await axios.put(`${BASE_URL}/prompt/${prompt.prompt_id}`, prompt);
  return response.data;
};

export const deletePrompt = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/prompt/${id}`);
};