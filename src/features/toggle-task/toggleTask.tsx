import { Checkbox } from "antd";
import { useAppDispatch } from "../../app/hooks";
import { taskModel } from "../../entities";
import { Task } from "../../shared/api";
import { useQueryClient } from "@tanstack/react-query";

export type ToggleTaskProps = {
	taskId: number; //Task | undefined;
	withStatus?: boolean;
}

export const ToggleTask = ({ taskId, withStatus = true }: ToggleTaskProps) => {
	const dispatch = useAppDispatch();
	const queryClient = useQueryClient();
	const task = taskModel.useTask(taskId);
	console.log('ToggleTask component -> task ->', task);

	if (!task) return null;

	const mutation = taskModel.updateTask(queryClient, dispatch);

	const onToggle = () => {
		//const togledTask = taskModel.toggleTask(task, dispatch);
		const togledTask = { ...task, completed: !task.completed };
		//console.log('onTogle -> task updated before mutation -> ', togledTask);
		mutation.mutate(togledTask);
	}

	const status = taskModel.getTaskStatus(task);

	return (
		<Checkbox onClick={onToggle} checked={task.completed} >
			{withStatus && status}
		</Checkbox>
	)
}