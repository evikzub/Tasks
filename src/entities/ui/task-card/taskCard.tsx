import { PropsWithChildren } from "react";
import { Button, Card } from "antd";
import { Task } from "../../../shared/api";

import styles from './styles.module.scss';
import { Link } from "react-router-dom";

export type TaskCardProps = PropsWithChildren<{
	data?: Task //import("shared/api").Task;
	//titleHref?: string;
	titleHref?(): void;
}> &
	import("antd").CardProps;

export const TaskCard = ({
	data,
	titleHref,
	children,
	...cardProps
}: TaskCardProps) => {
	if (!data && !cardProps.loading) return null;

	const Text = ({ text }: { text: string | undefined }) => {
		return (
			< span style={data?.completed ? { textDecoration: 'line-through' } : {}}> {text}</span >
		)
	}

	return (
		<Card
			title={`Task#${cardProps.loading ? "" : data?.id}`}
			className={styles.root}
			{...cardProps}
		>
			{/* {titleHref ? <Link to={titleHref} state={{ visible: true }} reloadDocument={false} >{data?.title}</Link> : data?.title} */}
			{titleHref ?
				<Button type="link" onClick={titleHref}>
					<Text text={data?.title} />
				</Button>
				: data?.title}
			<br />
			<p> <Text text={data?.note} /> </p>
			{children}
		</Card>
	);
};

//  {titleHref ? <Link to={titleHref}>{data?.title}</Link> : data?.title}
