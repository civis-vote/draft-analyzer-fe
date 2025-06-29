import axios from 'axios';
import { DocumentType } from '@/model/DocumentModels';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getDocumentTypes = async (): Promise<DocumentType[]> => {
  const response = await axios.get(`${BASE_URL}/document_types`);
  return response.data;
};

export const createDocumentType = async (doc: DocumentType): Promise<DocumentType> => {
  const response = await axios.post<DocumentType>(`${BASE_URL}/document_types`, doc);
  return response.data;
};

export const updateDocumentType = async (doc: DocumentType): Promise<DocumentType> => {
  const response = await axios.put<DocumentType>(`${BASE_URL}/document_types/${doc.doc_type_id}`, doc);
  return response.data;
};

export const deleteDocumentType = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/document_types/${id}`);
};
