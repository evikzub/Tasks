import { AxiosPromise } from 'axios';
import { apiInstance } from './base';
import type { Task } from '../types';

const BASE_URL = '/todos';

export type GetTasksListParams = {
	//userId?: number;
	//_sort?: string;
	//_order?: string;
	completed?: boolean;
};

export const getTaskList = (params?: GetTasksListParams): AxiosPromise<Task[]> => {
	// const params: GetTasksListParams = {
	// 	_sort: 'id',
	// 	_order: 'desc',
	// }
	return apiInstance.get<Task[]>(BASE_URL, { params });
};

export const getTaskById = (taskId: number): AxiosPromise<Task> => {
	return apiInstance.get<Task>(`${BASE_URL}/${taskId}`);
};

export const addTask = (task: Task): AxiosPromise<Task> => {
	return apiInstance.post(BASE_URL, task, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

export const updateTask = (task: Task): AxiosPromise<Task> => {
	return apiInstance.put(`${BASE_URL}/${task.id}`, task, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

export const deleteTask = (taskId: number): AxiosPromise<Task> => {
	return apiInstance.delete(`${BASE_URL}/${taskId}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
}