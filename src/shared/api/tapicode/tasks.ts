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