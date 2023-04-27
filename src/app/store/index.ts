import { configureStore } from "@reduxjs/toolkit";
import { taskModel } from "../../entities";

//import { taskModel } from "entities/task";

export const store = configureStore({
	reducer: {
		tasks: taskModel.reducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;