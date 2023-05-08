import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
//import { taskModel } from "../../entities";
import tasks from "../../entities/model/tasks";
import { usersApi } from "../../entities/model/users";

//import { taskModel } from "entities/task";

// export const store = configureStore({
// 	reducer: {
// 		tasks: taskModel.reducer,
// 	},
// });

const rootReducer = combineReducers({
	tasks,
	[usersApi.reducerPath]: usersApi.reducer,
})

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(usersApi.middleware),
	})
}

//export type RootState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
//export type AppDispatch = typeof store.dispatch;
export type AppDispatch = AppStore['dispatch'];