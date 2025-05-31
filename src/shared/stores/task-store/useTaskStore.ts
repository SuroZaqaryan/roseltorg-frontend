import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { http } from 'shared/api/http';
import type {Task, TaskApi} from './types';

interface TaskStore {
    activeStep: number;
    uploadedFile: File | null;
    tasks: Task[];
    loading: boolean;
    error: string | null;

    // UI actions
    setActiveStep: (step: number) => void;
    setUploadedFile: (file: File | null) => void;

    // API actions
    fetchTasks: () => Promise<void>;
    createTask: (taskData: TaskApi) => Promise<Task>;
    updateTask: (id: string, taskData: Partial<TaskApi>) => Promise<void>;
}

export const useTaskStore = create<TaskStore>()(
    devtools((set) => ({
        activeStep: 1,
        uploadedFile: null,
        tasks: [],
        loading: false,
        error: null,

        // UI actions
        setActiveStep: (step) => set({ activeStep: step }),
        setUploadedFile: (file) => set({ uploadedFile: file }),

        // API actions
        fetchTasks: async () => {
            set({ loading: true, error: null });
            try {
                const response = await http.get<Task[]>('/tasks');
                set({ tasks: response.data, loading: false });
            } catch (error) {
                set({ error: 'Failed to fetch tasks', loading: false });
            }
        },

        createTask: async (taskData) => {
            set({ loading: true });
            try {
                const response = await http.post<Task>('/tasks', taskData);
                set((state) => ({
                    tasks: [...state.tasks, response.data],
                    loading: false
                }));
                return response.data;
            } catch (error) {
                set({ error: 'Failed to create task', loading: false });
                throw error;
            }
        },

        updateTask: async (id, taskData) => {
            set({ loading: true });
            try {
                await http.patch(`/tasks/${id}`, taskData);
                set((state) => ({
                    tasks: state.tasks.map(task =>
                        task.id === id ? { ...task, ...taskData } : task
                    ),
                    loading: false
                }));
            } catch (error) {
                set({ error: 'Failed to update task', loading: false });
                throw error;
            }
        }
    }))
);