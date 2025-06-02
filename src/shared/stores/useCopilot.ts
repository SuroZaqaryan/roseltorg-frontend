import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UploadedFile {
  name: string;
  type: string;
  url: string;
}

interface TaskStore {
  uploadedFile: UploadedFile | null;
  setUploadedFile: (file: UploadedFile | null) => void;
}

export const useTaskStore = create<TaskStore>()(
  devtools((set) => ({
    uploadedFile: null,
    setUploadedFile: (file) => set({ uploadedFile: file }, false, 'setUploadedFile'),
  }))
);