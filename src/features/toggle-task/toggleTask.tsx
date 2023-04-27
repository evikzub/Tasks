import { Checkbox } from "antd";
import { useAppDispatch } from "../../app/hooks";
import { taskModel } from "../../entities";
import { Task } from "../../shared/api";

export type ToggleTaskProps = {
	task: Task | undefined;
	withStatus?: boolean;
}

export const ToggleTask = ({ task, withStatus = true }: ToggleTaskProps) => {
	const dispatch = useAppDispatch();
	//const task = taskModel.useTask(taskId);
	console.log('ToggleTask feature -> task ->', task);

	if (!task) return null;

	const mutation = taskModel.updateTask();

	const onToggle = () => {
		const togledTask = taskModel.toggleTask(task, dispatch);
		//taskModel.useTask(task.id);
		//if(togledTask)
		mutation.mutate(togledTask);
		//taskModel.toggleTask(task, dispatch);
	}

	const status = taskModel.getTaskStatus(task);

	return (
		<Checkbox onClick={onToggle} checked={task.completed} >
			{withStatus && status}
		</Checkbox>
	)
}