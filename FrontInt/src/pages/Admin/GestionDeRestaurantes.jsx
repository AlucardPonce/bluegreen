import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Space, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import restaurantService from '../../service/restaurantService';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_APIKEY = 'AIzaSyD6vEAeGtBjMT1zQUlFnuvJV9YORgXSFGk';

const mapContainerStyle = {
	width: '100%',
	height: '400px',
	borderRadius: '8px'
};

const defaultCenter = {
	lat: 21.1877, // Arroyo Seco, Querétaro
	lng: -99.6783
};

function GestionDeRestaurantes() {
	const [restaurants, setRestaurants] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingRestaurant, setEditingRestaurant] = useState(null);
	const [selectedPosition, setSelectedPosition] = useState(null);
	const [form] = Form.useForm();

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: GOOGLE_MAPS_APIKEY
	});

	const fetchRestaurants = async () => {
		setLoading(true);
		try {
			const resp = await restaurantService.listRestaurants();
			setRestaurants(resp.data || []);
		} catch (error) {
			console.error(error);
			message.error('Error cargando restaurantes');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchRestaurants(); }, []);

	const handleCreate = () => {
		setEditingRestaurant(null);
		setSelectedPosition(defaultCenter);
		form.resetFields();
		setModalVisible(true);
	};

	const handleEdit = (record) => {
		setEditingRestaurant(record);
		setSelectedPosition({
			lat: record.latitude,
			lng: record.longitude
		});
		form.setFieldsValue({
			name: record.name,
			schedule: record.schedule,
		});
		setModalVisible(true);
	};

	const handleDelete = (record) => {
		Modal.confirm({
			title: 'Eliminar restaurante',
			content: `¿Estás seguro de eliminar ${record.name}?`,
			onOk: async () => {
				try {
					await restaurantService.deleteRestaurant(record.id);
					message.success('Restaurante eliminado');
					fetchRestaurants();
				} catch (err) {
					console.error(err);
					message.error('Error eliminando restaurante');
				}
			}
		});
	};

	const handleMapClick = (e) => {
		setSelectedPosition({
			lat: e.latLng.lat(),
			lng: e.latLng.lng()
		});
	};

	const handleSubmit = async (values) => {
		if (!selectedPosition) {
			message.error('Por favor selecciona una ubicación en el mapa');
			return;
		}

		try {
			const data = {
				...values,
				latitude: selectedPosition.lat,
				longitude: selectedPosition.lng
			};

			if (editingRestaurant) {
				await restaurantService.updateRestaurant(editingRestaurant.id, data);
				message.success('Restaurante actualizado');
			} else {
				await restaurantService.createRestaurant(data);
				message.success('Restaurante creado');
			}
			setModalVisible(false);
			form.resetFields();
			fetchRestaurants();
		} catch (err) {
			console.error(err);
			message.error('Error guardando restaurante');
		}
	};

	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Horarios',
			dataIndex: 'schedule',
			key: 'schedule',
		},
		{
			title: 'Ubicación',
			key: 'location',
			render: (_, record) => (
				<a
					href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}
					target="_blank"
					rel="noopener noreferrer"
					style={{ color: '#66bb6a' }}
				>
					<EnvironmentOutlined /> Ver en mapa
				</a>
			)
		},
		{
			title: 'Acciones',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Editar
					</Button>
					<Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
						Eliminar
					</Button>
				</Space>
			)
		}
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
						Gestión de Restaurantes
					</h1>
					<p style={{ margin: '8px 0 0', color: '#666', fontSize: '14px' }}>
						Administra los restaurantes y lugares de comida
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
					Nuevo restaurante
				</Button>
			</div>

			<Table
				dataSource={restaurants}
				columns={columns}
				rowKey="id"
				loading={loading}
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showTotal: (total) => `Total ${total} restaurantes`
				}}
			/>

			<Modal
				title={editingRestaurant ? 'Editar Restaurante' : 'Nuevo Restaurante'}
				open={modalVisible}
				onCancel={() => {
					setModalVisible(false);
					form.resetFields();
				}}
				footer={null}
				width={800}
				destroyOnClose
			>
				<Form form={form} layout="vertical" onFinish={handleSubmit}>
					<Form.Item
						name="name"
						label="Nombre del Restaurante"
						rules={[{ required: true, message: 'El nombre es requerido' }]}
					>
						<Input size="large" placeholder="Ej: Gorditas Doña Mary" />
					</Form.Item>

					<Form.Item
						name="schedule"
						label="Horarios de Atención"
						rules={[{ required: true, message: 'Los horarios son requeridos' }]}
					>
						<Input size="large" placeholder="Ej: Lun-Dom 8:00 AM - 8:00 PM" />
					</Form.Item>

					<Form.Item label="Ubicación en el Mapa">
						<p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
							Haz click en el mapa o arrastra el pin para seleccionar la ubicación del restaurante
						</p>
						{isLoaded ? (
							<GoogleMap
								mapContainerStyle={mapContainerStyle}
								center={selectedPosition || defaultCenter}
								zoom={15}
								onClick={handleMapClick}
							>
								{selectedPosition && (
									<Marker
										position={selectedPosition}
										draggable={true}
										onDragEnd={(e) => {
											setSelectedPosition({
												lat: e.latLng.lat(),
												lng: e.latLng.lng()
											});
										}}
									/>
								)}
							</GoogleMap>
						) : (
							<div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '8px' }}>
								Cargando mapa...
							</div>
						)}
					</Form.Item>

					{selectedPosition && (
						<div style={{
							padding: '12px',
							background: '#f0f9f0',
							borderRadius: '8px',
							marginBottom: '16px',
							border: '1px solid #c8e6c9'
						}}>
							<strong style={{ color: '#2e7d32' }}>Ubicación seleccionada:</strong>
							<div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
								Lat: {selectedPosition.lat.toFixed(6)}, Lng: {selectedPosition.lng.toFixed(6)}
							</div>
						</div>
					)}

					<Form.Item>
						<Space>
							<Button
								type="primary"
								htmlType="submit"
								size="large"
								style={{
									background: '#66bb6a',
									borderColor: '#66bb6a',
								}}
							>
								{editingRestaurant ? 'Actualizar' : 'Crear'}
							</Button>
							<Button size="large" onClick={() => {
								setModalVisible(false);
								form.resetFields();
							}}>
								Cancelar
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}

export default GestionDeRestaurantes;
