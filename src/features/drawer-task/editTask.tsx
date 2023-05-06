import { Button, Checkbox, Divider, Drawer, Form, Input, Space } from "antd"
import { ChangeEventHandler, useState, useEffect, ChangeEvent } from "react";
import { PlusSquareOutlined } from '@ant-design/icons';

import styles from './styles.module.scss';
import TextArea from "antd/es/input/TextArea";
import { Task } from "../../shared/api";
import { useAppDispatch } from "../../app/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { taskModel } from "../../entities";

export type EditTaskProps = {
	task: Task | undefined;
	visible: boolean;
	setVisible: (visible: boolean) => void;
}

type FormFields = {
	id: HTMLInputElement,
	title: HTMLInputElement,
	completed: HTMLInputElement,
	note: HTMLInputElement,
}

// https://claritydev.net/blog/typescript-typing-form-events-in-react

const TaskEdit = ({ task, visible = false, setVisible }: EditTaskProps) => {
	const [updatedTask, setUpdatedTask] = useState<Task>();

	const dispatch = useAppDispatch();
	const queryClient = useQueryClient();
	const mutation = taskModel.updateTask(queryClient, dispatch);

	//update values after Task change
	useEffect(
		() => {
			setUpdatedTask(task);
			//console.log('TaskEdit -> useEfect', task);
		}, [task]
	)

	const onClose = () => {
		setVisible(false);
		setUpdatedTask(task);
	};

	//const onSave: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
	const onSave: React.FormEventHandler<HTMLFormElement & FormFields> = (event) => {
		//console.log(event.currentTarget);
		event.preventDefault();
		const form = event.currentTarget;
		const { id, title, completed, note } = form;

		if (updatedTask) {
			setUpdatedTask({
				...updatedTask,
				title: title.value,
				completed: completed.checked,
				note: note.value,
			});
			mutation.mutate(updatedTask);
		}
		//console.log("updatedTask ->", updatedTask);
		setVisible(false);
	}

	//const onChangeInput: ChangeEventHandler<HTMLInputElement> = (event) => {
	const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (updatedTask) {
			const value = (event.target.type === "checkbox") ? event.target.checked : event.target.value;
			setUpdatedTask({ ...updatedTask, [event.target.name]: value });
		}
		//console.log(updatedTask);
	}

	const onChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (updatedTask) {
			setUpdatedTask({ ...updatedTask, [event.target.name]: event.target.value });
		}
		//console.log(updatedTask);
	}

	// const onChangeCheckbox = (event: CheckboxChangeEvent) => {
	// 	//console.log(event.target.checked);
	// 	if (updatedTask)
	// 		setUpdatedTask({ ...updatedTask, completed: event.target.checked });
	// }

	return (
		<Drawer
			className={styles.container}
			title="Edit Task"
			placement="right"
			closable={false}
			onClose={onClose}
			open={visible}
			getContainer={false}
		>
			<Form name="task-edit" onSubmitCapture={onSave} >
				<Input name="id" value={updatedTask?.id} type='hidden' />
				<Input
					prefix={<PlusSquareOutlined />}
					name="title"
					placeholder="task title..."
					value={updatedTask?.title}
					required
					onChange={onChangeInput}
					suffix={
						// <Checkbox name="completed" checked={updatedTask?.completed} onChange={onChangeCheckbox} />
						<Input type='checkbox' name="completed" checked={updatedTask?.completed} onChange={onChangeInput} />
					} />
				<br />
				<br />
				<TextArea
					name='note'
					placeholder="Add note..."
					style={{ height: 220, marginBottom: 24 }}
					showCount
					allowClear
					autoSize={{ minRows: 2, maxRows: 10 }}
					value={updatedTask?.note}
					onChange={onChangeTextArea}
				/>
				<Divider />
				<Space wrap>
					<Button type="primary" ghost htmlType="submit">Save</Button>
					<Button type="text" onClick={onClose} >Cancel</Button>
				</Space>
			</Form>
		</Drawer >
	)
}

export default TaskEdit;