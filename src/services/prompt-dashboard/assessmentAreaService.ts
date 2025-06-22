import axios from 'axios';
import { AssessmentArea } from '@/model/AssessmentAreaModel';

const BASE_URL = 'http://127.0.0.1:8000/api';

export const getAssessmentAreas = async (): Promise<AssessmentArea[]> => {
  const response = await axios.get<AssessmentArea[]>(`${BASE_URL}/assessment_areas`);
  return response.data;
};

export const createAssessmentArea = async (area: Partial<AssessmentArea>): Promise<AssessmentArea> => {
  const response = await axios.post<AssessmentArea>(`${BASE_URL}/assessment_areas`, area);
  return response.data;
};

export const updateAssessmentArea = async (area: Partial<AssessmentArea>): Promise<AssessmentArea> => {
  const response = await axios.put<AssessmentArea>(
    `${BASE_URL}/assessment_areas/${area.assessment_id}`,
    area
  );
  return response.data;
};

export const deleteAssessmentArea = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/assessment_areas/${id}`);
};

export const getAssessmentAreaById = async (id: number): Promise<AssessmentArea> => {
  const response = await axios.get(`${BASE_URL}/assessment_areas/${id}`);
  return response.data;
};

