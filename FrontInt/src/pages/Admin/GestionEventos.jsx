import React, { useEffect, useMemo, useState } from 'react';
import {
  Button, Card, DatePicker, Empty, Form, Grid, Input, InputNumber,
  Modal, Popconfirm, Select, Space, Switch, Table, Tag, TimePicker, message
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined,
  CheckCircleTwoTone, CloseCircleTwoTone, SearchOutlined,
  CalendarOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  crearEvento, obtenerEventos, actualizarEvento, eliminarEvento, cambiarEstadoEvento
} from '../../service/eventoService';
import { Typography } from 'antd';
const { Title, Text } = Typography;

const { useBreakpoint } = Grid;
const { TextArea } = Input;
const { Option } = Select;

const categoriasOpts = [
  { label: 'Conciertos', value: 'conciertos' },
  { label: 'Gastronomía', value: 'gastronomia' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Deportivo', value: 'deportivo' },
];

const formatearPrecio = (precio) => (!precio || precio === 0 || precio === '0'
  ? 'Gratis'
  : `$${parseFloat(precio).toLocaleString('es-MX')} MXN`);

const GestionEventos = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await obtenerEventos();
      const ordenados = [...data].sort((a, b) => new Date(a.fecha || 0) - new Date(b.fecha || 0));
      setEventos(ordenados);
    } catch (err) {
      message.error(err?.message || 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = useMemo(() => {
    if (!busqueda) return eventos;
    const q = busqueda.toLowerCase();
    return eventos.filter((e) =>
      e.nombre?.toLowerCase().includes(q) ||
      e.descripcion?.toLowerCase().includes(q) ||
      e.categoria?.toLowerCase().includes(q) ||
      e.ubicacion?.toLowerCase().includes(q)
    );
  }, [busqueda, eventos]);

  const abrirNuevo = () => {
    setEditando(null);
    form.resetFields();
    setModalOpen(true);
  };

  const abrirEditar = (ev) => {
    setEditando(ev);
    form.setFieldsValue({
      nombre: ev.nombre,
      descripcion: ev.descripcion,
      fecha: ev.fecha ? dayjs(ev.fecha) : null,
      hora: ev.hora ? dayjs(ev.hora, 'HH:mm') : null,
      ubicacion: ev.ubicacion,
      categoria: ev.categoria,
      precio: typeof ev.precio === 'string' ? Number(ev.precio) : ev.precio,
      imagen: ev.imagen,
      destacado: !!ev.destacado,
      estado: ev.estado || 'activo',
    });
    setModalOpen(true);
  };

  const onCerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    form.resetFields();
  };

  const normalizar = (vals) => ({
    nombre: vals.nombre?.trim(),
    descripcion: vals.descripcion?.trim() || '',
    fecha: vals.fecha ? dayjs(vals.fecha).format('YYYY-MM-DD') : '',
    hora: vals.hora ? dayjs(vals.hora).format('HH:mm') : '',
    ubicacion: vals.ubicacion?.trim() || '',
    categoria: vals.categoria || '',
    precio: typeof vals.precio === 'number' ? vals.precio : Number(vals.precio || 0),
    imagen: vals.imagen?.trim() || '',
    destacado: !!vals.destacado,
    estado: vals.estado || 'activo',
  });

  const onSubmit = async () => {
    try {
      const vals = await form.validateFields();
      const payload = normalizar(vals);
      setSubmitLoading(true);
      if (editando?.id) {
        await actualizarEvento(editando.id, payload);
        message.success('Evento actualizado');
      } else {
        await crearEvento(payload);
        message.success('Evento creado');
      }
      onCerrarModal();
      cargar();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err?.message || 'Error al guardar el evento');
    } finally {
      setSubmitLoading(false);
    }
  };

  const onEliminar = async (id) => {
    try {
      await eliminarEvento(id);
      message.success('Evento eliminado');
      cargar();
    } catch (err) {
      message.error(err?.message || 'Error al eliminar evento');
    }
  };

  const onCambiarEstado = async (ev, nuevo) => {
    try {
      await cambiarEstadoEvento(ev.id, nuevo ? 'activo' : 'inactivo');
      message.success(`Estado cambiado a ${nuevo ? 'activo' : 'inactivo'}`);
      cargar();
    } catch (err) {
      message.error(err?.message || 'Error al cambiar estado');
    }
  };

  const columnas = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', ellipsis: true },
    {
      title: 'Fecha', dataIndex: 'fecha', key: 'fecha', render: (v, r) => (
        <Space size={4}><CalendarOutlined /><span>{v || '-'}</span><span>{r.hora ? `· ${r.hora}h` : ''}</span></Space>
      ), responsive: ['sm'],
    },
    { title: 'Categoría', dataIndex: 'categoria', key: 'categoria', render: (c) => c || '-', responsive: ['md'] },
    { title: 'Precio', dataIndex: 'precio', key: 'precio', render: (p) => formatearPrecio(p), responsive: ['lg'] },
    {
      title: 'Estado', dataIndex: 'estado', key: 'estado',
      render: (e) => (e === 'activo' || e === 'activa' ? <Tag color="green">Activo</Tag> : <Tag>Inactivo</Tag>)
    },
    {
      title: 'Acciones', key: 'acciones',
      render: (_, record) => {
        const activo = record.estado === 'activo' || record.estado === 'activa';
        return (
          <Space wrap>
            <Button size="small" icon={<EditOutlined />} onClick={() => abrirEditar(record)}>Editar</Button>
            <Popconfirm title="¿Eliminar evento?" okText="Sí" cancelText="No" onConfirm={() => onEliminar(record.id)}>
              <Button size="small" danger icon={<DeleteOutlined />}>Eliminar</Button>
            </Popconfirm>
            <Switch checked={activo} checkedChildren="Activo" unCheckedChildren="Inactivo"
              onChange={(checked) => onCambiarEstado(record, checked)} />
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Card
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid rgba(102, 187, 106, 0.2)',
          marginBottom: '24px'
        }}
        bodyStyle={{ padding: 24 }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <Title level={3} style={{ margin: 0, color: '#2e7d32' }}>
              <CalendarOutlined /> Gestión de Eventos
            </Title>
            <Text style={{ color: '#666' }}>
              Total: {eventos.length} eventos
            </Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={cargar} loading={loading}>
              Actualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={abrirNuevo}
              style={{
                background: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
                border: 'none',
                height: '40px',
                fontWeight: '600'
              }}
            >
              Nuevo Evento
            </Button>
          </Space>
        </div>

        <Space
          direction="horizontal"
          style={{ width: '100%', marginBottom: 16 }}
          size="middle"
          wrap
        >
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Buscar por nombre, descripción, categoría o ubicación"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ minWidth: 260 }}
          />
        </Space>

        {isMobile ? (
          filtrados.length === 0 ? (
            <Empty description="Sin eventos" />
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {filtrados.map((ev) => {
                const activo = ev.estado === 'activo' || ev.estado === 'activa';
                return (
                  <Card key={ev.id} size="small" hoverable
                    cover={(ev.imagen || ev.fotos?.[0]) ? (
                      <img alt={ev.nombre} src={ev.imagen || ev.fotos?.[0]} style={{ height: 160, objectFit: 'cover' }} />
                    ) : null}
                    actions={[
                      <Button key="edit" type="link" icon={<EditOutlined />} onClick={() => abrirEditar(ev)}>Editar</Button>,
                      <Popconfirm key="del" title="¿Eliminar evento?" okText="Sí" cancelText="No" onConfirm={() => onEliminar(ev.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />}>Eliminar</Button>
                      </Popconfirm>,
                      <Switch key="state" checked={activo} onChange={(c) => onCambiarEstado(ev, c)}
                        checkedChildren="Activo" unCheckedChildren="Inactivo" />,
                    ]}
                  >
                    <Card.Meta
                      title={<Space>{activo ? <CheckCircleTwoTone twoToneColor="#52c41a" /> :
                        <CloseCircleTwoTone twoToneColor="#bfbfbf" />}<span>{ev.nombre}</span></Space>}
                      description={
                        <div>
                          <div style={{ marginBottom: 6 }}><CalendarOutlined /> {ev.fecha || '-'} {ev.hora ? `· ${ev.hora}h` : ''}</div>
                          <div style={{ marginBottom: 6 }}><EnvironmentOutlined /> {ev.ubicacion || 'Ubicación no definida'}</div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <Tag>{ev.categoria || 'Sin categoría'}</Tag>
                            <Tag color={(!ev.precio || ev.precio === 0 || ev.precio === '0') ? 'green' : 'blue'}>
                              {formatearPrecio(ev.precio)}
                            </Tag>
                            {ev.destacado ? <Tag color="red">Destacado</Tag> : null}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                );
              })}
            </Space>
          )
        ) : (
          <Table
            rowKey="id"
            loading={loading}
            dataSource={filtrados}
            columns={columnas}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>

      <Modal
        title={
          <div style={{
            background: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
            margin: '-20px -24px 20px -24px',
            padding: '20px 24px',
            color: 'white'
          }}>
            <Title level={4} style={{ color: 'white', margin: 0 }}>
              <CalendarOutlined style={{ marginRight: 12 }} />
              {editando ? 'Editar Evento' : 'Nuevo Evento'}
            </Title>
          </div>
        }
        open={modalOpen}
        onCancel={onCerrarModal}
        onOk={onSubmit}
        okText={editando ? 'Actualizar' : 'Crear'}
        confirmLoading={submitLoading}
        destroyOnClose
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <Form form={form} layout="vertical" initialValues={{ estado: 'activo', destacado: false, precio: 0 }}>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'El nombre es obligatorio' }]}>
            <Input placeholder="Nombre del evento" />
          </Form.Item>
          <Form.Item name="descripcion" label="Descripción"><TextArea rows={3} placeholder="Descripción del evento" /></Form.Item>

          <Space style={{ width: '100%' }} direction={isMobile ? 'vertical' : 'horizontal'} size="middle">
            <Form.Item name="fecha" label="Fecha" style={{ flex: 1, minWidth: 180 }}
              rules={[{ required: true, message: 'La fecha es obligatoria' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="hora" label="Hora" style={{ flex: 1, minWidth: 160 }}>
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Form.Item name="ubicacion" label="Ubicación"><Input placeholder="Lugar del evento" /></Form.Item>

          <Space style={{ width: '100%' }} direction={isMobile ? 'vertical' : 'horizontal'} size="middle">
            <Form.Item name="categoria" label="Categoría" style={{ flex: 1, minWidth: 200 }}>
              <Select placeholder="Selecciona una categoría" allowClear>
                {categoriasOpts.map((c) => <Option key={c.value} value={c.value}>{c.label}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="precio" label="Precio (MXN)" style={{ flex: 1, minWidth: 150 }}>
              <InputNumber style={{ width: '100%' }} min={0} step={10} />
            </Form.Item>
          </Space>

          <Form.Item name="imagen" label="Imagen (URL)"><Input placeholder="https://..." /></Form.Item>

          <Space size="large" wrap>
            <Form.Item name="destacado" label="Destacado" valuePropName="checked"><Switch /></Form.Item>
            <Form.Item name="estado" label="Estado">
              <Select style={{ minWidth: 140 }}>
                <Option value="activo">Activo</Option>
                <Option value="inactivo">Inactivo</Option>
              </Select>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default GestionEventos;
