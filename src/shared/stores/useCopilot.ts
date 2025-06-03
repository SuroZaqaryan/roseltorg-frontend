import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface TaskUploadedFile {
  name: string;
  type: string;
  url: string;
}

interface TaskStore {
  uploadedFile: TaskUploadedFile | null;
  setUploadedFile: (file: TaskUploadedFile | null) => void;
}

export const useTaskStore = create<TaskStore>()(
  devtools((set) => ({
    uploadedFile: null,
    setUploadedFile: (file) => set({ uploadedFile: file }, false, 'setUploadedFile'),
  }))
);