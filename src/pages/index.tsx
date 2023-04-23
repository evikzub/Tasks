import { lazy } from "react"
import { Route, Routes } from "react-router-dom"
import TaskDetails from "./task-details";

const TaskListPage = lazy(() => import('./task-list'));

export const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={ <TaskListPage /> } />
            <Route path='/:taskId' element={ <TaskDetails /> } />
        </Routes>
    )
}