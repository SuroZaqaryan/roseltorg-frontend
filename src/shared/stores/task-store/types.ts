export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
    createdAt: string;
    // другие поля
}

export interface TaskApi {
    title: string;
    description?: string;
    file?: File; // если нужно
}