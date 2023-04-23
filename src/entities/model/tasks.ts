import {
    //createAsyncThunk,
    createSelector,
    createSlice,
    Dispatch,
    PayloadAction,
} from '@reduxjs/toolkit';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
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
            console.log('StateData -> ', state.data);
            //state.data = [...state.data, task];
            state.data.push(task);
        },
        toggleTask: ({ data }, { payload: taskId }: PayloadAction<number>) => {
            data[taskId].completed = !data[taskId].completed;
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

export const { toggleTask } = taskModel.actions;
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

// export const getTaskListAsync = createAsyncThunk<
//     Task[],
//     void,
//     { rejectValue: string }
//     >('tasks/fetchTasks', async function (_, { rejectWithValue }) {
//     console.log('getTaskListAsync');
//     const response = await typicodeApi.getTaskList();
//     //if (response.status.)

//     return await response.data;
// });

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

// selectors

export const getfilteredTasks = () => {
    console.log('getfilteredTasks');
    return useSelector(
        createSelector(
            (state: RootState) => state.tasks.queryConfig,
            (state: RootState) => state.tasks.data,
            (
                queryConfig: RootState['tasks']['queryConfig'],
                tasks: RootState['tasks']['data']
            ) =>
                Object.values(tasks).filter(
                    (task) =>
                        queryConfig?.completed === undefined ||
                        task?.completed === queryConfig.completed
                )
        )
    );
};

export const useTask = (taskId: number) => {
    const result = useSelector(
        createSelector(
            (state: RootState) => state.tasks.data,
            //(tasks) => tasks[taskId]
            (tasks) => tasks.find((task) => task.id === taskId)
            //Object.values(tasks).find((task) => task.id === taskId)
        )
        //(state: RootState) => state.tasks.data.find((task) => task.id === taskId)
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
