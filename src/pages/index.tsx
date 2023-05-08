import { lazy } from "react"
import { Route, Routes } from "react-router-dom"
import TaskDetails from "./task-details";

const TaskListPage = lazy(() => import('./task-list'));
const UserListPage = lazy(() => import('./user-list'));

export const Routing = () => {
	return (
		<Routes>
			<Route path="/" element={<TaskListPage />} />
			<Route path='/:taskId' element={<TaskDetails />} />
			<Route path="/users" element={<UserListPage />} />
		</Routes>
	)
}