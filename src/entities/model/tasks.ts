import {
    //createAsyncThunk,
    createSelector,
    createSlice,
    current,
    Dispatch,
    PayloadAction,
} from '@reduxjs/toolkit';
import {produce} from 'immer';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { Task, typicodeApi } from '../../shared/api';

type QueryConfig = {
    completed?: boolean;
    userId?: number;
};

type TasksState = {
    data: Task[];
    queryConfig?: QueryConfig;
};

const initialState: TasksState = {
    data: [],
    queryConfig: {},
};

export const taskModel = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTaskList: (state, action: PayloadAction<Task[]>) => {
            state.data = action.payload;
        },
        addTaskToList: (state, { payload: task }: PayloadAction<Task>) => {
            //state.data = { ...state.data, ...normalizeTask(task).entities.tasks };
            console.log('addTaskToList -> ', task);
            console.log('StateData -> ', current(state.data));
            if(state.data.find((values) => values.id !== task.id))
                state.data.push(task);
        },

        //state.date & action.payload
        toggleTask: ( {data: tasks}, { payload: taskId }: PayloadAction<number>) => {
            const task = tasks.find(value => value.id === taskId)
            if(task)
                task.completed = !task.completed;
        },
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(getTaskListAsync.pending, (state, action) => {
    //             console.log('getTaskListAsync loading...');
    //         })
    //         .addCase(getTaskListAsync.fulfilled, (state, action) => {
    //             console.log('getTaskListAsync loading...');
    //             state.data = action.payload;
    //         });
    // },
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
        onSuccess: ({data}) => {
            console.log('Set Task list -> ', data);
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
        onSuccess: ({data}) => {
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

export const updateTask = () => useMutation({
    mutationKey: [TASK_SINGLE_QUERY_KEY, 'toggle'],
    mutationFn: (task: Task) => typicodeApi.updateTask(task),
    onSuccess(data, variables) {
        console.log('Task updated', data, variables);
    },
    onError(error) {
        console.log('Task update error ->', error);            
    },
}) 

export const toggleTask = (task: Task, dispatch: Dispatch) => {
    console.log('toggleTask -> ', task);
    dispatch(taskModel.actions.toggleTask(task.id));

    const value = produce(task, draft => {
        draft.completed = !draft.completed;
    });
    return value;

    //updateTask().mutate(value);
    //console.log('toggleTask -> value', value);
}

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
                //Object.values(tasks).filter(
                tasks.filter(
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
            (tasks) => tasks.find((task) => task.id === taskId)
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
