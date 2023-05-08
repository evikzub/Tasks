import React, { FC, useEffect, useState } from 'react';
import { usersApi } from '../../entities/model/users';
import { Button, Col, Form, Input, Layout, Modal, Row, Typography } from 'antd';
import { IUser } from '../../shared/api';
//import { TaskRow } from '../../entities';

import { DeleteOutlined, UserOutlined, MailOutlined } from '@ant-design/icons'
import styles from './styles.module.scss';
const { Paragraph } = Typography;

//enum Action { create, edit }

const UserList: FC = () => {
	const [visible, setVisible] = useState(false);
	const [limit, setLimit] = useState(100);
	const [user, setUser] = useState<IUser>();
	const { data: users, error, isLoading, refetch } = usersApi.useFetchAllUsersQuery(limit);
	const [deleteUser, { }] = usersApi.useDeleteUserMutation();

	const showModal = (value?: IUser) => {
		setUser(value);
		setVisible(true);
	}

	return (
		<Layout>
			<UserModal visible={visible} setVisible={setVisible} user={user} />
			<Layout>
				<Row justify='center'>
					<Typography.Title level={1}>Users list</Typography.Title>
				</Row>
				<Button onClick={() => showModal()} >Add User</Button>
			</Layout>
			<Layout className={styles.user__list}>
				<Row gutter={[0, 20]} justify='center' >
					{users && PageContent({ users, showModal, deleteUser })}
				</Row>
			</Layout>
		</Layout>
	)
}

type PageContentProps = {
	users: IUser[];
	showModal: (value: IUser) => void;
	deleteUser: (value: IUser) => void;
}

const PageContent = ({ users, showModal, deleteUser }: PageContentProps) => {

	const editUser = (user: IUser) => {
		showModal(user);
	}

	return (
		users.map(user => (
			<Col key={user.id} span={24} >
				<Row className={styles.user}>
					{/* <Paragraph editable={{}}>
						{user.name}
					</Paragraph> */}
					<Button type='link' onClick={() => editUser(user)} >{user.name}</Button>
					<span>{user.email}</span>
					<Button type="primary" shape="circle"
						icon={<DeleteOutlined />}
						onClick={() => deleteUser(user)}
					/>
				</Row>
			</Col>
		))
	)
}

type UserModalProps = {
	visible: boolean;
	setVisible: (value: boolean) => void;
	user: IUser | undefined;
}

const UserModal: FC<UserModalProps> = (
	{ visible, setVisible, user }) => {

	const [form] = Form.useForm();
	const [createUser, { }] = usersApi.useCreateUserMutation();
	const [updateUser, { }] = usersApi.useUpdateUserMutation();

	useEffect(() => {
		console.log('User -> ', user);
		console.log('Form -> ', form);
		form.setFieldValue(['user', 'name'], user?.name);
		form.setFieldValue(['user', 'email'], user?.email);
	}, [user])

	const layout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 20 },
	};

	/* eslint-disable no-template-curly-in-string */
	const validateMessages = {
		required: '${label} is required!',
		types: {
			email: '${label} is not a valid email!',
		},
	};
	/* eslint-enable no-template-curly-in-string */

	const handleCancel = () => {
		//console.log('Modal -> handleCancel');
		setVisible(false);
		form.resetFields();
	}

	const onFinish = (values: any) => {
		const name = values.user.name;
		const email = values.user.email;
		if (!user) {
			const newUser: IUser = {
				name,
				email,
			} as IUser
			//console.log(newUser);
			createUser(newUser);
		}
		else {
			const updatedUser: IUser = {
				...user, name, email
			}
			updateUser(updatedUser);
		}
		//console.log(values.user.name);
		//console.log(values.user.email);
		handleCancel();
	};

	return (
		<Modal
			title={(user) ? 'Edit User' : 'Create User'}
			open={visible}
			onCancel={handleCancel}
			//destroyOnClose={true}
			footer={[
				<Button key="back" onClick={handleCancel}>
					Return
				</Button>,
				<Button key="submit" type="primary" form='userForm' htmlType="submit" >
					Submit
				</Button>,
			]}
		>
			<Form
				id='userForm'
				{...layout}
				form={form}
				name="nest-messages"
				onFinish={onFinish}
				//style={{ maxWidth: 600 }}
				validateMessages={validateMessages}

			>
				{/* <Form.Item name={['user', 'id']} label="id" hidden >
					<Input />
				</Form.Item> */}
				<Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]} initialValue={user?.name} >
					<Input prefix={<UserOutlined />} />
				</Form.Item>
				<Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email' }]} initialValue={user?.email}>
					<Input prefix={<MailOutlined />} />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default UserList;