import { Checkbox } from "antd";
import { useAppDispatch } from "../../app/hooks";
import { taskModel } from "../../entities";
import { Task } from "../../shared/api";

export type ToggleTaskProps = {
    taskId: number;
    withStatus?: boolean;
}

export const ToggleTask = ({ taskId, withStatus = true }: ToggleTaskProps) => {
    const dispatch = useAppDispatch();
    const task = taskModel.useTask(taskId);

    if (!task) return null;

    const onToggle = () => dispatch(taskModel.toggleTask(taskId));

    const status = taskModel.getTaskStatus(task);

    return (
        <Checkbox onClick={onToggle} checked={task.completed} >
            { withStatus && status }
        </Checkbox>
    )
}