import { Col, Empty, Layout, Row, Spin, Typography } from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { taskModel, TaskRow } from "../../entities";
import { getTaskListAsync } from "../../entities/model";
import { ToggleTask } from "../../features/toggle-task/toggleTask";

const TaskList = () => {
	return (
		<Layout>
			<Layout>
				<Row justify='center'>
					<Typography.Title level={1}>Tasks list</Typography.Title>
				</Row>
				<Row justify='center'>
					{/* <TaskFilters /> */}
				</Row>
			</Layout>
			<Layout>
				<Row gutter={[0, 20]} justify='center' >
					{PageContent()}
				</Row>
			</Layout>
		</Layout>
	)
}

function PageContent() {
	const dispatch = useAppDispatch();
	console.log('PageContent');

	const { isFetching } = taskModel.getTaskListAsync(dispatch);

	const isEmpty = taskModel.isTasksEmpty();
	const filteredTasks = taskModel.getfilteredTasks();
	//const filteredTasks = useAppSelector(state => state.tasks.data);
	//console.log('filteredTasks ->', filteredTasks);

	if (isFetching) return <Spin size="large" />;
	if (isEmpty) return <Empty description="No tasks found" />;

	return filteredTasks.map((task) => (
		<Col key={task.id} span={24}>
			<TaskRow
				data={task}
				titleHref={`/${task.id}`}
				before={<ToggleTask task={task} withStatus={false} />}
			/>
		</Col>
	));
}

export default TaskList;