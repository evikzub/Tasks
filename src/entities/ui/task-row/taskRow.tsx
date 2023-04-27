import { PropsWithChildren, ReactNode } from "react";
import { Row } from "antd";
import { Task } from "../../../shared/api";
import { Link } from "react-router-dom";

import cn from 'classnames';
import styles from './styles.module.scss';

export type TaskRowProps = PropsWithChildren<{
	data: Task;//import("shared/api").Task;
	titleHref?: string;
	before?: ReactNode;
}>;

export const TaskRow = ({ data, before, titleHref }: TaskRowProps) => {
	const title =
		titleHref ?
			<Link to={titleHref}>{data.title}</Link>
			:
			data.title
		;

	return (
		<Row className={cn(styles.root, { [styles.completed]: data.completed })}
		>
			{before}
			{title}
		</Row>
	);
};