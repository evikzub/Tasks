import { Button, Layout, Result, Spin } from "antd";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { TaskCard } from "../../entities";
import { taskModel } from "../../entities";
import { ToggleTask } from "../../features/toggle-task/toggleTask";
import { Task } from "../../shared/api";

import styles from './styles.module.scss';

const TaskDetails = () => {
    const dispatch = useAppDispatch();
    const { taskId } = useParams();
    console.log('TaskDetails -> taskId ->',taskId);
    //const task = taskModel.useTask(+taskId!);
    //Why if causes an error on page reload?
    //act-dom.development.js:16381 Uncaught Error: Rendered fewer hooks than expected.
    //if (!task) {
        //console.log('!task, ', task);
        const {isFetching, isError, data: task} = taskModel.getTaskByIdAsync(+taskId!, dispatch);
        console.log('TaskDetails -> isFetching -> ', isFetching, ' data -> ', task?.data);
        //if (isFetching) return <Spin size="large" />;
    //}
    
    if (!task && isError)
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
                    data={task?.data}
                    size='default'
                    loading={isFetching}
                    className={styles.card}
                    bodyStyle={{ height: 400 }}
                    extra={<Link to='/'>Back to tasks list</Link> }
                    actions={[<ToggleTask key='toggle' taskId={+taskId!} /> ]}
                />
            </Layout.Content>
        </Layout>
    )
}

export default TaskDetails;