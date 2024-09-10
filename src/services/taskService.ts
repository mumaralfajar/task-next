import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/tasks',
});

export interface Task {
    id?: number;
    title: string;
    description: string;
}

export const getTasks = async (page: number = 1): Promise<any> => {
    const response = await axios.get(`http://localhost:3000/tasks?page=${page}&size=5`);
    return response.data;
};

export const createTask = async (task: Task): Promise<Task> => {
    const response = await api.post('/', task);
    return response.data;
};

export const updateTask = async (id: number, task: Task): Promise<Task> => {
    const response = await api.put(`/${id}`, task);
    return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
};
