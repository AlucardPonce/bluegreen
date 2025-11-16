import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import userService from '../../service/userService';
import { Form, Input, Select, Switch } from 'antd';

function GestionDeUsuarios() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingUser, setEditingUser] = useState(null);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const resp = await userService.listUsers();
			setUsers(resp.data || []);
		} catch (error) {
			console.error(error);
			message.error('Error cargando usuarios');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchUsers(); }, []);

		const [form] = Form.useForm();

		const handleCreate = () => { setEditingUser(null); form.resetFields(); setModalVisible(true); };

		const handleEdit = (record) => { setEditingUser(record); form.setFieldsValue({
			firstName: record.firstName,
			lastName: record.lastName,
			email: record.email,
			phone: record.phone,
			role: record.role,
			isActive: record.isActive,
		}); setModalVisible(true); };

	const handleDelete = (record) => {
		Modal.confirm({
			title: 'Desactivar usuario',
			content: `¿Desactivar a ${record.firstName} ${record.lastName}?`,
			onOk: async () => {
				try {
					await userService.deleteUser(record.id);
					message.success('Usuario desactivado');
					fetchUsers();
				} catch (err) {
					console.error(err);
					message.error('Error desactivando usuario');
				}
			}
		});
	};

	const columns = [
		{ title: 'Nombre', dataIndex: 'firstName', key: 'firstName', render: (_, r) => `${r.firstName} ${r.lastName}` },
		{ title: 'Email', dataIndex: 'email', key: 'email' },
		{ title: 'Teléfono', dataIndex: 'phone', key: 'phone' },
		{ title: 'Rol', dataIndex: 'role', key: 'role' },
		{ title: 'Activo', dataIndex: 'isActive', key: 'isActive', render: v => (v ? 'Sí' : 'No') },
		{ title: 'Acciones', key: 'actions', render: (_, record) => (
			<Space>
				<Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Editar</Button>
				<Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>Desactivar</Button>
			</Space>
		) }
	];

	return (
		<div style={{
			background: 'rgba(255,255,255,0.65)',
			backdropFilter: 'blur(20px)',
			borderRadius: '16px',
			padding: '32px',
			boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
		}}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
				<div>
					<h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#2e7d32' }}>
						Gestión de Usuarios
					</h1>
					<p style={{ margin: '8px 0 0', color: '#666', fontSize: '14px' }}>
						Administra los usuarios del sistema
					</p>
				</div>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={handleCreate}
					size="large"
					style={{
						background: '#66bb6a',
						borderColor: '#66bb6a',
						borderRadius: '8px',
						fontWeight: '500',
					}}
				>
					Nuevo usuario
				</Button>
			</div>

			<Input
				placeholder="Buscar usuarios por nombre, email o teléfono..."
				prefix={<span style={{ color: '#43a047' }}>🔍</span>}
				size="large"
				style={{
					borderRadius: '8px',
					marginBottom: '24px',
					border: '2px solid #e0e0e0',
				}}
				onChange={(e) => {
					console.log(e.target.value);
				}}
			/>

			<Table
				dataSource={users}
				columns={columns}
				rowKey="id"
				loading={loading}
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showTotal: (total) => `Total ${total} usuarios`
				}}
			/>

					<Modal visible={modalVisible} footer={null} onCancel={() => { setModalVisible(false); form.resetFields(); }} destroyOnClose>
						<Form form={form} layout="vertical" onFinish={async (values) => {
							try {
								if (editingUser) {
									await userService.updateUser(editingUser.id, values);
									message.success('Usuario actualizado');
								} else {
									await userService.createUser(values);
									message.success('Usuario creado');
								}
								setModalVisible(false);
								form.resetFields();
								fetchUsers();
							} catch (err) {
								console.error(err);
								message.error('Error guardando usuario');
							}
						}}>
							<Form.Item name="firstName" label="Nombre" rules={[{ required: true }]}> 
								<Input />
							</Form.Item>

							<Form.Item name="lastName" label="Apellido" rules={[{ required: true }]}> 
								<Input />
							</Form.Item>

							<Form.Item name="email" label="Correo" rules={[{ required: true, type: 'email' }]}> 
								<Input />
							</Form.Item>

							<Form.Item name="phone" label="Teléfono"> 
								<Input />
							</Form.Item>

							{!editingUser && (
								<Form.Item name="password" label="Contraseña" rules={[{ required: true, min: 6 }]}>
									<Input.Password />
								</Form.Item>
							)}

							<Form.Item name="role" label="Rol" initialValue="user">
								<Select>
									<Select.Option value="user">Usuario</Select.Option>
									<Select.Option value="admin">Administrador</Select.Option>
								</Select>
							</Form.Item>

							<Form.Item name="isActive" label="Activo" valuePropName="checked" initialValue={true}>
								<Switch />
							</Form.Item>

							<Form.Item>
								<Button type="primary" htmlType="submit">{editingUser ? 'Actualizar' : 'Crear'}</Button>
							</Form.Item>
						</Form>
					</Modal>
		</div>
	);
}

export default GestionDeUsuarios;

