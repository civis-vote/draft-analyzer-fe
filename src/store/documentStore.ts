import { DocumentType, UploadResponse } from '@/model/DocumentModels';
import { create } from 'zustand';
import {
  getDocumentTypes,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
} from '@/services/prompt-dashboard/documentTypeService';

interface DocumentState {
  fileUploaded: boolean;
  summaryRequested: boolean;
  uploadResponse: UploadResponse | null;
  setUploadResponse: (response: UploadResponse | null) => void;
  setFileUploaded: (uploaded: boolean) => void;
  setSummaryRequested: (requested: boolean) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  fileUploaded: false,
  summaryRequested: false,
  uploadResponse: null,
  setFileUploaded: (uploaded) => set({ fileUploaded: uploaded }),
  setSummaryRequested: (requested) => set({ summaryRequested: requested }),
  setUploadResponse: (response: UploadResponse | null) => set({ uploadResponse: response }),
}));

// stores/documentTypeStore

interface DocumentTypeStore {
  documentTypes: DocumentType[];
  documentTypesLoading: boolean;
  documentTypesError: string | null;

  fetchDocumentTypes: () => Promise<void>;
  addDocumentType: (docType: DocumentType) => Promise<void>;
  updateDocumentTypeById: (docType: DocumentType) => Promise<void>;
  deleteDocumentTypeById: (id: number) => Promise<void>;
}

export const useDocumentTypeStore = create<DocumentTypeStore>((set, get) => ({
  documentTypes: [],
  documentTypesLoading: false,
  documentTypesError: null,

  fetchDocumentTypes: async () => {
    set({ documentTypesLoading: true, documentTypesError: null });
    try {
      const data = await getDocumentTypes();
      set({ documentTypes: data });
    } catch (err) {
      set({ documentTypesError: 'Failed to fetch document types' });
    } finally {
      set({ documentTypesLoading: false });
    }
  },

  addDocumentType: async (docType) => {
    const created = await createDocumentType(docType);
    set((state) => ({
      documentTypes: [...state.documentTypes, created],
    }));
  },

  updateDocumentTypeById: async (docType) => {
    const updated = await updateDocumentType(docType);
    set((state) => ({
      documentTypes: state.documentTypes.map((dt) =>
        dt.doc_type_id === updated.doc_type_id ? updated : dt
      ),
    }));
  },

  deleteDocumentTypeById: async (id) => {
    await deleteDocumentType(id);
    set((state) => ({
      documentTypes: state.documentTypes.filter((dt) => dt.doc_type_id !== id),
    }));
  },
}));
