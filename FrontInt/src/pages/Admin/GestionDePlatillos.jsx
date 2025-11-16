import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, message, Form, Input, Select, Upload, Row, Col, Spin, Empty, Popconfirm, Carousel } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import * as dishService from '../../service/dishService';
import restaurantService from '../../service/restaurantService';

const { TextArea } = Input;
const { Meta } = Card;

function GestionDePlatillos() {
	const [dishes, setDishes] = useState([]);
	const [restaurants, setRestaurants] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingDish, setEditingDish] = useState(null);
	const [imageFiles, setImageFiles] = useState([]);
	const [form] = Form.useForm();

	const fetchDishes = async () => {
		setLoading(true);
		try {
			const resp = await dishService.listDishes();
			setDishes(resp.data || []);
		} catch (error) {
			console.error(error);
			message.error('Error cargando platillos');
		} finally {
			setLoading(false);
		}
	};

	const fetchRestaurants = async () => {
		try {
			const resp = await restaurantService.listRestaurants();
			setRestaurants(resp.data || []);
		} catch (error) {
			console.error(error);
			message.error('Error cargando restaurantes');
		}
	};

	useEffect(() => {
		fetchDishes();
		fetchRestaurants();
	}, []);

	const handleCreate = () => {
		setEditingDish(null);
		setImageFiles([]);
		form.resetFields();
		setModalVisible(true);
	};

	const handleEdit = (record) => {
		setEditingDish(record);

		// Convertir las imágenes existentes a formato de fileList
		const existingImages = (record.images || []).map((url, index) => ({
			uid: `-${index}`,
			name: `imagen-${index}.jpg`,
			status: 'done',
			url: url,
		}));

		setImageFiles(existingImages);
		form.setFieldsValue({
			name: record.name,
			description: record.description,
			restaurantId: record.restaurantId,
		});
		setModalVisible(true);
	};

	const handleDelete = async (record) => {
		try {
			await dishService.deleteDish(record.id);
			message.success('Platillo eliminado');
			fetchDishes();
		} catch (err) {
			console.error(err);
			message.error('Error eliminando platillo');
		}
	};

	const compressAndConvertImage = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.onload = () => {
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');

					// Redimensionar imagen manteniendo aspect ratio
					let width = img.width;
					let height = img.height;
					const maxSize = 800; // Tamaño máximo

					if (width > height) {
						if (width > maxSize) {
							height = (height * maxSize) / width;
							width = maxSize;
						}
					} else {
						if (height > maxSize) {
							width = (width * maxSize) / height;
							height = maxSize;
						}
					}

					canvas.width = width;
					canvas.height = height;

					ctx.drawImage(img, 0, 0, width, height);

					// Comprimir a 60% de calidad
					const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
					resolve(compressedBase64);
				};
				img.onerror = reject;
				img.src = e.target.result;
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	const handleImageChange = ({ fileList }) => {
		setImageFiles(fileList);
	};

	const handleSubmit = async (values) => {
		try {
			const restaurant = restaurants.find(r => r.id === values.restaurantId);

			const data = {
				...values,
				restaurantName: restaurant?.name || '',
			};

			// Procesar imágenes con compresión
			const images = [];
			for (const file of imageFiles) {
				if (file.originFileObj) {
					// Nueva imagen - comprimir antes de guardar
					const compressedBase64 = await compressAndConvertImage(file.originFileObj);
					images.push(compressedBase64);
				} else if (file.url) {
					// Imagen existente
					images.push(file.url);
				}
			}

			data.images = images;

			if (editingDish) {
				await dishService.updateDish(editingDish.id, data);
				message.success('Platillo actualizado');
			} else {
				await dishService.createDish(data);
				message.success('Platillo creado');
			}

			setModalVisible(false);
			setImageFiles([]);
			form.resetFields();
			fetchDishes();
		} catch (err) {
			console.error(err);
			message.error('Error al guardar platillo');
		}
	};

	return (
		<div style={{
			background: 'rgba(255,255,255,0.65)',
			backdropFilter: 'blur(20px)',
			borderRadius: '16px',
			padding: '32px',
			boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
		}}>
			<div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h2 style={{ margin: 0, color: '#2e7d32', fontWeight: 600, fontSize: '28px' }}>Platillos Tradicionales</h2>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={handleCreate}
					size="large"
					style={{
						background: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
						border: 'none',
						boxShadow: '0 4px 12px rgba(67,160,71,0.3)',
						height: '48px',
						fontSize: '16px',
						fontWeight: 500
					}}
				>
					Nuevo Platillo
				</Button>
			</div>

			{loading ? (
				<div style={{ textAlign: 'center', padding: '60px 0' }}>
					<Spin size="large" />
				</div>
			) : dishes.length === 0 ? (
				<Empty
					description="No hay platillos registrados"
					style={{ padding: '60px 0' }}
				/>
			) : (
				<Row gutter={[24, 24]}>
					{dishes.map((dish) => (
						<Col xs={24} sm={12} lg={8} xl={6} key={dish.id}>
							<Card
								hoverable
								cover={
									<div style={{
										height: '240px',
										overflow: 'hidden',
										background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
										position: 'relative'
									}}>
										{dish.images && dish.images.length > 0 ? (
											dish.images.length === 1 ? (
												<img
													alt={dish.name}
													src={dish.images[0]}
													style={{
														width: '100%',
														height: '100%',
														objectFit: 'cover'
													}}
												/>
											) : (
												<Carousel
													autoplay
													autoplaySpeed={3000}
													arrows
													prevArrow={<LeftOutlined />}
													nextArrow={<RightOutlined />}
													style={{ height: '100%' }}
												>
													{dish.images.map((img, idx) => (
														<div key={idx} style={{ height: '240px' }}>
															<img
																alt={`${dish.name} ${idx + 1}`}
																src={img}
																style={{
																	width: '100%',
																	height: '240px',
																	objectFit: 'cover'
																}}
															/>
														</div>
													))}
												</Carousel>
											)
										) : (
											<div style={{
												height: '100%',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center'
											}}>
												<PlusOutlined style={{ fontSize: 48, color: '#66bb6a' }} />
											</div>
										)}
									</div>
								}
								actions={[
									<EditOutlined
										key="edit"
										onClick={() => handleEdit(dish)}
										style={{ fontSize: '18px', color: '#43a047' }}
									/>,
									<Popconfirm
										key="delete"
										title="Eliminar platillo"
										description={`¿Estás seguro de eliminar ${dish.name}?`}
										onConfirm={() => handleDelete(dish)}
										okText="Sí"
										cancelText="No"
										okButtonProps={{ danger: true }}
									>
										<DeleteOutlined
											style={{ fontSize: '18px', color: '#f44336', cursor: 'pointer' }}
										/>
									</Popconfirm>
								]}
								style={{
									borderRadius: '16px',
									overflow: 'hidden',
									boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
									border: '1px solid rgba(102,187,106,0.2)',
									background: 'rgba(255,255,255,0.9)'
								}}
							>
								<Meta
									title={
										<div style={{
											fontSize: '18px',
											fontWeight: 600,
											color: '#2e7d32',
											marginBottom: '8px'
										}}>
											{dish.name}
										</div>
									}
									description={
										<div>
											<p style={{
												color: '#666',
												fontSize: '14px',
												marginBottom: '12px',
												lineHeight: '1.5',
												display: '-webkit-box',
												WebkitLineClamp: 3,
												WebkitBoxOrient: 'vertical',
												overflow: 'hidden'
											}}>
												{dish.description}
											</p>
											<div style={{
												display: 'flex',
												alignItems: 'center',
												gap: '6px',
												color: '#43a047',
												fontSize: '13px',
												fontWeight: 500
											}}>
												<EnvironmentOutlined />
												{dish.restaurantName}
											</div>
											{dish.images && dish.images.length > 1 && (
												<div style={{
													marginTop: '8px',
													fontSize: '12px',
													color: '#999',
													display: 'flex',
													alignItems: 'center',
													gap: '4px'
												}}>
													<span>📸</span>
													{dish.images.length} {dish.images.length === 1 ? 'foto' : 'fotos'}
												</div>
											)}
										</div>
									}
								/>
							</Card>
						</Col>
					))}
				</Row>
			)}

			<Modal
				title={
					<div style={{ fontSize: '20px', fontWeight: 600, color: '#2e7d32' }}>
						{editingDish ? 'Editar Platillo' : 'Nuevo Platillo'}
					</div>
				}
				open={modalVisible}
				onCancel={() => {
					setModalVisible(false);
					setImageFiles([]);
					form.resetFields();
				}}
				footer={null}
				width={700}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
				>
					<Form.Item
						label="Nombre del platillo"
						name="name"
						rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
					>
						<Input
							placeholder="Ej: Enchiladas queretanas"
							size="large"
						/>
					</Form.Item>

					<Form.Item
						label="Descripción"
						name="description"
						rules={[{ required: true, message: 'Por favor ingresa la descripción' }]}
					>
						<TextArea
							rows={4}
							placeholder="Describe el platillo tradicional, sus ingredientes principales y lo que lo hace especial..."
							size="large"
						/>
					</Form.Item>

					<Form.Item
						label="Restaurante"
						name="restaurantId"
						rules={[{ required: true, message: 'Por favor selecciona un restaurante' }]}
					>
						<Select
							placeholder="Selecciona el restaurante donde se sirve"
							size="large"
						>
							{restaurants.map(r => (
								<Select.Option key={r.id} value={r.id}>
									{r.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						label="Imágenes del platillo"
						extra="Puedes subir hasta 3 imágenes PNG o JPG (máx. 5MB cada una)"
					>
						<Upload
							listType="picture-card"
							fileList={imageFiles}
							maxCount={3}
							accept=".png,.jpg,.jpeg,image/png,image/jpeg"
							beforeUpload={(file) => {
								const isValidType = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg';
								if (!isValidType) {
									message.error('Solo puedes subir archivos PNG o JPG');
									return Upload.LIST_IGNORE;
								}
								const isLt5M = file.size / 1024 / 1024 < 5;
								if (!isLt5M) {
									message.error('La imagen debe ser menor a 5MB');
									return Upload.LIST_IGNORE;
								}
								return false;
							}}
							onChange={handleImageChange}
						>
							{imageFiles.length < 3 && (
								<div>
									<PlusOutlined />
									<div style={{ marginTop: 8 }}>Subir imagen</div>
								</div>
							)}
						</Upload>
					</Form.Item>

					<Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
						<Button
							onClick={() => {
								setModalVisible(false);
								setImageFiles([]);
								form.resetFields();
							}}
							size="large"
							style={{ marginRight: 12 }}
						>
							Cancelar
						</Button>
						<Button
							type="primary"
							htmlType="submit"
							size="large"
							style={{
								background: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
								border: 'none',
								fontWeight: 500
							}}
						>
							{editingDish ? 'Actualizar' : 'Crear'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}

export default GestionDePlatillos;
