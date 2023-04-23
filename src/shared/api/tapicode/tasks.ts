import { AxiosPromise } from 'axios';
import { apiInstance } from './base';
import type { Task } from './model';

const BASE_URL = '/todos';

export const getTaskList = (): AxiosPromise<Task[]> => {
    return apiInstance.get(BASE_URL);
};

export const getTaskById = (taskId: number): AxiosPromise<Task> => {
    return apiInstance.get(`${BASE_URL}/${taskId}`);
};
