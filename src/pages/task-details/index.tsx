import { Button, Layout, Result, Spin } from "antd";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { TaskCard } from "../../entities";
import { taskModel } from "../../entities";
import { ToggleTask } from "../../features/toggle-task/toggleTask";

import styles from './styles.module.scss';
import TaskEdit from "../../features/drawer-task/editTask";
import { useState } from "react";

const TaskDetails = () => {
	const [edit, setEdit] = useState<boolean>(false);

	const showEdit = () => {
		setEdit(true);
	};

	const dispatch = useAppDispatch();
	const { taskId } = useParams<string>();
	//const { state } = useLocation();
	//console.log('Card -> state ->', state?.visible)

	console.log('TaskDetails -> taskId ->', useParams());
	//let task = taskModel.useTask(+taskId!);
	//Why if causes an error on page reload?
	//act-dom.development.js:16381 Uncaught Error: Rendered fewer hooks than expected.
	//if (!task) {
	//console.log('!task, ', task);
	const { isFetching, isError, data: value } = taskModel.getTaskByIdAsync(+taskId!, dispatch);
	console.log('TaskDetails -> isFetching -> ', isFetching, ' data -> ', value);
	if (isFetching) return <Spin size="large" />;
	const task = value?.data;
	//}

	if (!task || isError)
		return (
			<Result
				status={404}
				title={404}
				subTitle={`Task ${taskId} was not found`}
				extra={
					<Link to='/'>
						<Button type='primary'>Back to task list</Button>
					</Link>
				}
			/>
		);

	return (
		<Layout className={styles.root}>
			<Layout.Content className={styles.content}>
				<TaskCard
					data={task}
					titleHref={showEdit} //{`/${task?.id}/edit`}
					size='default'
					loading={isFetching}
					className={styles.card}
					bodyStyle={{ height: 400 }}
					extra={<Link to='/'>Back to tasks list</Link>}
					actions={[<ToggleTask key='toggle' taskId={+taskId!} />]}
				>
					<TaskEdit task={task} visible={edit} setVisible={setEdit} />
				</TaskCard>
			</Layout.Content>
		</Layout>
	)
}

export default TaskDetails;