import {
	//createAsyncThunk,
	createSelector,
	createSlice,
	current,
	Dispatch,
	PayloadAction,
} from '@reduxjs/toolkit';
//import { produce } from 'immer';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { Task, typicodeApi } from '../../shared/api';

type QueryConfig = {
	completed?: boolean;
	userId?: number;
};

type TasksState = {
	data: Record<number, Task>;
	queryConfig?: QueryConfig;
};

const initialState: TasksState = {
	data: {}, //[],
	queryConfig: {},
};

export const taskModel = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		setTaskList: (state, action: PayloadAction<Task[]>) => {
			console.log('Reducer -> setTaskList -> assign new data');
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
			state.data =
				action.payload.reduce((record, task: Task) => {
					record[task.id] = task;
					return record;
				}, {} as Record<number, Task>)
		},
		addTaskToList: (state, { payload: task }: PayloadAction<Task>) => {
			//console.log('Reducer -> addTaskToList -> ', task);
			//const tasks = state.data.filter((values) => values.id !== task.id);
			//tasks.push(task);
			state.data[task.id] = task;
			console.log('Reducer -> addTaskToList -> ', current(state.data));
		},

		//state.date & action.payload
		_toggleTask: ({ data: tasks }, { payload: taskId }: PayloadAction<number>) => {
			//console.log('Reducer -> toggleTask -> task before -> ', current(tasks));
			// const task = tasks.find(value => value.id === taskId)
			// if (task) {
			// 	console.log('Reducer -> toggleTask -> task before', current(task))
			// 	task.completed = !task.completed;
			// }
			tasks[taskId].completed = !tasks[taskId].completed;
			console.log('Reducer -> toggleTask -> task after', current(tasks));
		},
		updateTask: ({ data: tasks }, { payload: task }: PayloadAction<Task>) => {
			//console.log('Reducer -> updateTask -> task before -> ', current(tasks));
			// const task = tasks.find(value => value.id === taskId)
			// if (task) {
			// 	console.log('Reducer -> toggleTask -> task before', current(task))
			// 	task.completed = !task.completed;
			// }
			tasks[task.id] = task;
			console.log('Reducer -> updateTask -> task after', current(tasks));
		},

	},
});

//export const { toggleTask } = taskModel.actions;
//export const { actions } = taskModel;

// react-query actions (everything that async)

const TASK_LIST_QUERY_KEY = 'tasks';
const TASK_SINGLE_QUERY_KEY = 'task-single';

export const getTaskListAsync = (dispatch: Dispatch) => {
	console.log('getTaskListAsync');
	const response = useQuery({
		queryKey: [TASK_LIST_QUERY_KEY],
		queryFn: () => typicodeApi.getTaskList(),
		refetchOnWindowFocus: false,
		onSuccess: ({ data }) => {
			console.log('getTaskListAsync -> Set Task list -> ', data);
			dispatch(taskModel.actions.setTaskList(data))
		},
		onError(err: Error) {
			console.error(err.message);
		},
	});
	return response;
}

export const getTaskByIdAsync = (taskId: number, dispatch: Dispatch) => {
	console.log('getTaskByIdAsync -> ', taskId);
	const response = useQuery({
		queryKey: [TASK_SINGLE_QUERY_KEY, taskId],
		queryFn: () => typicodeApi.getTaskById(taskId),
		// The query will not execute until the taskId exists
		enabled: !!taskId,
		refetchOnWindowFocus: false,
		retry: false,
		//retryDelay: 1000,
		onSuccess: ({ data }) => {
			console.log('getTaskByIdAsync -> onSuccess -> Task ->', data);
			dispatch(taskModel.actions.addTaskToList(data))
		},
		onError(err: Error) {
			console.error(err.message);
		},
	});
	console.log('getTaskByIdAsync -> ', taskId, 'response ->', response);
	return response;
};

export const updateTask = (client: QueryClient, dispatch: Dispatch) => useMutation({
	mutationKey: [TASK_SINGLE_QUERY_KEY, 'update'],
	mutationFn: (task: Task) => typicodeApi.updateTask(task),
	onSuccess(data, variables) {
		console.log('Task updated', data, variables);
		//?invalidate does not work?
		//client.invalidateQueries({ queryKey: [TASK_LIST_QUERY_KEY] });
		//client.invalidateQueries({ queryKey: [TASK_SINGLE_QUERY_KEY, data.data.id] });
		client.setQueryData([TASK_SINGLE_QUERY_KEY, variables.id], data);
		dispatch(taskModel.actions.updateTask(variables));
	},
	onError(error) {
		console.log('Task update error ->', error);
	},
})

// export const _toggleTask = (task: Task, dispatch: Dispatch) => {
// 	console.log('taskModel -> toggleTask -> ', task);
// 	dispatch(taskModel.actions._toggleTask(task.id));

// 	const value = produce(task, draft => {
// 		draft.completed = !draft.completed;
// 	});
// 	return value;
// }

// selectors
// Memoizing Selectors with createSelector
// https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns
export const getfilteredTasks = () => {
	const values = useSelector(
		createSelector(
			(state: RootState) => state.tasks.queryConfig,
			(state: RootState) => state.tasks.data,
			(
				//queryConfig: RootState['tasks']['queryConfig'],
				//tasks: RootState['tasks']['data']
				config,
				tasks
			) =>
				Object.values(tasks).filter(
					//tasks.filter(
					(task) =>
						config?.completed === undefined ||
						task?.completed === config.completed
				)
		)
	);
	console.log('getfilteredTasks -> ', values);
	return values;
};

export const useTask = (taskId: number) => {
	const result = useSelector(
		createSelector(
			(state: RootState) => state.tasks.data,
			(tasks) => tasks[taskId] //tasks.find((task) => task.id === taskId)
			//tasks.filter((task) => task.id === taskId)
		)
	);
	console.log('useTask -> ', taskId, ' found -> ', result);
	return result;
};

export const isTasksEmpty = (): boolean =>
	useSelector(
		createSelector(
			(state: RootState) => state.tasks.data,
			(tasks) => Object.keys(tasks).length === 0
		)
	);

export const getTaskStatus = (data: Task): string => {
	return data.completed ? 'CLOSED' : 'OPENED';
};

export const reducer = taskModel.reducer;
