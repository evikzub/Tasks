import { Button, Col, Empty, Form, Input, InputRef, Layout, Row, Space, Spin, Typography, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { taskModel, TaskRow } from "../../entities";
import { ToggleTask } from "../../features/toggle-task/toggleTask";
import { PlusSquareOutlined } from '@ant-design/icons';
import { Task } from "../../shared/api";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { MouseEventHandler, useRef } from "react";
import { DeleteOutlined } from '@ant-design/icons'
import { Dispatch, ThunkDispatch } from "@reduxjs/toolkit";


const TaskList = () => {

	const dispatch = useAppDispatch();
	const queryClient = useQueryClient();
	const mutation = taskModel.addTask(queryClient, dispatch);

	const inputTitle = useRef<InputRef>(null);
	const [messageApi, contextHolder] = message.useMessage();

	const addTask = (event: React.MouseEvent<HTMLAnchorElement & HTMLButtonElement>) => {
		const title = inputTitle.current?.input;
		if (title && title?.validity.valueMissing) {
			//console.log('addTask -> validity', title?.validity);
			//inputTitle.current.input?.required = true;
			//title.setCustomValidity('Missing title');
			messageApi.open({
				type: 'error',
				content: 'Missing title',
			});
		}

		if (title && !title?.validity.valueMissing) {
			console.log('addTask', title);
			const task: Task = { id: 0, title: title.value, completed: false }
			title.value = '';
			//console.log(task);
			mutation.mutate(task);
			//event.currentTarget.reset();
		}
	}

	return (
		<Layout>
			{contextHolder}
			<Layout>
				<Row justify='center'>
					<Typography.Title level={1}>Tasks list</Typography.Title>
				</Row>
				<Row justify='center'>
					<Space.Compact style={{ width: '50%', padding: '10px' }}>
						<Input ref={inputTitle} name="title" prefix={<PlusSquareOutlined />} placeholder="Add Task..."
							required />
						<Button type="primary" onClick={addTask} >Add</Button>
					</Space.Compact>
				</Row>
				<Row justify='center'>
					{/* <TaskFilters /> */}
				</Row>
			</Layout>
			<Layout>
				<Row gutter={[0, 20]} justify='center' >
					{PageContent(dispatch, queryClient)}
				</Row>
			</Layout>
		</Layout>
	)
}

function PageContent(dispatch: Dispatch, queryClient: QueryClient) {
	//const dispatch = useAppDispatch();
	//const queryClient = useQueryClient();
	const mutation = taskModel.deleteTask(queryClient, dispatch);
	console.log('PageContent');

	const { isFetching } = taskModel.getTaskListAsync(dispatch);

	const isEmpty = taskModel.isTasksEmpty();
	const filteredTasks = taskModel.getfilteredTasks();
	//const filteredTasks = useAppSelector(state => state.tasks.data);
	//console.log('filteredTasks ->', filteredTasks);

	if (isFetching) return <Spin size="large" />;
	if (isEmpty) return <Empty description="No tasks found" />;

	const deleteTask = (taskId: number) => {
		console.log('deleteTask');
		mutation.mutate(taskId);
	}

	return filteredTasks.map((task) => (
		<Col key={task.id} span={24}>
			<TaskRow
				data={task}
				titleHref={`/${task.id}`}
				before={<ToggleTask taskId={task.id} withStatus={false} />}
				after={<Button type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => deleteTask(task.id)} />}
			/>
		</Col>
	));
}

export default TaskList;