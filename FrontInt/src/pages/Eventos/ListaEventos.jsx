import React, { useState, useEffect } from 'react';
import { Input, Checkbox, Radio, Button, Select, Card, Tag, Empty, Spin } from 'antd';
import {
    SearchOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    HeartOutlined,
    HeartFilled,
    AppstoreOutlined,
    UnorderedListOutlined,
    EnvironmentFilled
} from '@ant-design/icons';
import { obtenerEventos } from '../../service/eventoService';
import './ListaEventos.css';

const { Option } = Select;

const ListaEventos = () => {
    // Estados
    const [eventos, setEventos] = useState([]);
    const [eventosFiltrados, setEventosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados de filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [categorias, setCategorias] = useState({
        conciertos: false,
        gastronomia: false,
        cultural: false,
        deportivo: false
    });
    const [filtroPrecio, setFiltroPrecio] = useState('todos');
    const [ordenamiento, setOrdenamiento] = useState('fecha');
    const [vistaActual, setVistaActual] = useState('lista');
    const [favoritos, setFavoritos] = useState([]);

    // Cargar eventos al montar
    useEffect(() => {
        cargarEventos();
    }, []);

    // Aplicar filtros cuando cambien
    useEffect(() => {
        aplicarFiltros();
    }, [searchTerm, fechaDesde, fechaHasta, categorias, filtroPrecio, ordenamiento, eventos]);

    const cargarEventos = async () => {
        try {
            setLoading(true);
            const data = await obtenerEventos();

            // Filtrar solo eventos activos
            const eventosActivos = data.filter(evento =>
                evento.estado === 'activo' || evento.estado === 'activa'
            );

            setEventos(eventosActivos);
            setEventosFiltrados(eventosActivos);
        } catch (err) {
            console.error('Error al cargar eventos:', err);
            setError('No se pudieron cargar los eventos');
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltros = () => {
        let resultado = [...eventos];

        // Filtro por búsqueda
        if (searchTerm) {
            resultado = resultado.filter(evento =>
                evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                evento.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro por fechas
        if (fechaDesde) {
            resultado = resultado.filter(evento =>
                new Date(evento.fecha) >= new Date(fechaDesde)
            );
        }
        if (fechaHasta) {
            resultado = resultado.filter(evento =>
                new Date(evento.fecha) <= new Date(fechaHasta)
            );
        }

        // Filtro por categorías
        const categoriasSeleccionadas = Object.keys(categorias).filter(key => categorias[key]);
        if (categoriasSeleccionadas.length > 0) {
            resultado = resultado.filter(evento =>
                categoriasSeleccionadas.includes(evento.categoria?.toLowerCase())
            );
        }

        // Filtro por precio
        if (filtroPrecio === 'gratuitos') {
            resultado = resultado.filter(evento =>
                !evento.precio || evento.precio === 0 || evento.precio === '0'
            );
        } else if (filtroPrecio === 'pago') {
            resultado = resultado.filter(evento =>
                evento.precio && evento.precio !== 0 && evento.precio !== '0'
            );
        }

        // Ordenamiento
        switch (ordenamiento) {
            case 'fecha':
                resultado.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                break;
            case 'popularidad':
                resultado.sort((a, b) => (b.asistentes || 0) - (a.asistentes || 0));
                break;
            case 'precio-menor':
                resultado.sort((a, b) => (a.precio || 0) - (b.precio || 0));
                break;
            case 'precio-mayor':
                resultado.sort((a, b) => (b.precio || 0) - (a.precio || 0));
                break;
            default:
                break;
        }

        setEventosFiltrados(resultado);
    };

    const handleCategoriaChange = (categoria) => {
        setCategorias(prev => ({
            ...prev,
            [categoria]: !prev[categoria]
        }));
    };

    const limpiarFiltros = () => {
        setSearchTerm('');
        setFechaDesde('');
        setFechaHasta('');
        setCategorias({
            conciertos: false,
            gastronomia: false,
            cultural: false,
            deportivo: false
        });
        setFiltroPrecio('todos');
    };

    const toggleFavorito = (eventoId) => {
        setFavoritos(prev => {
            if (prev.includes(eventoId)) {
                return prev.filter(id => id !== eventoId);
            } else {
                return [...prev, eventoId];
            }
        });
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        const opciones = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return date.toLocaleDateString('es-MX', opciones);
    };

    const formatearPrecio = (precio) => {
        if (!precio || precio === 0 || precio === '0') {
            return 'Gratis';
        }
        return `$${parseFloat(precio).toLocaleString('es-MX')} MXN`;
    };

    if (loading) {
        return (
            <div className="eventos-container">
                <div className="loading-container">
                    <Spin size="large" />
                    <p>Cargando eventos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="eventos-container">
                <div className="error-container">
                    <p>{error}</p>
                    <Button type="primary" onClick={cargarEventos}>
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="eventos-container">
            {/* Sidebar de Filtros */}
            <aside className="eventos-sidebar">
                <div className="sidebar-header">
                    <CalendarOutlined className="sidebar-icon" />
                    <h1 className="sidebar-title">Eventia</h1>
                </div>

                <div className="filtros-container">
                    {/* Búsqueda */}
                    <div className="filtro-section">
                        <h2 className="filtro-label">Buscar por nombre</h2>
                        <Input
                            size="large"
                            placeholder="Buscar por palabra clave..."
                            prefix={<SearchOutlined />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Fechas */}
                    <div className="filtro-section">
                        <h2 className="filtro-label">Fechas</h2>
                        <div className="date-inputs">
                            <div className="date-input-wrapper">
                                <label>Desde</label>
                                <Input
                                    type="date"
                                    value={fechaDesde}
                                    onChange={(e) => setFechaDesde(e.target.value)}
                                />
                            </div>
                            <div className="date-input-wrapper">
                                <label>Hasta</label>
                                <Input
                                    type="date"
                                    value={fechaHasta}
                                    onChange={(e) => setFechaHasta(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Categorías */}
                    <div className="filtro-section">
                        <h2 className="filtro-label">Categorías</h2>
                        <div className="checkbox-group">
                            <Checkbox
                                checked={categorias.conciertos}
                                onChange={() => handleCategoriaChange('conciertos')}
                            >
                                Conciertos
                            </Checkbox>
                            <Checkbox
                                checked={categorias.gastronomia}
                                onChange={() => handleCategoriaChange('gastronomia')}
                            >
                                Gastronomía
                            </Checkbox>
                            <Checkbox
                                checked={categorias.cultural}
                                onChange={() => handleCategoriaChange('cultural')}
                            >
                                Cultural
                            </Checkbox>
                            <Checkbox
                                checked={categorias.deportivo}
                                onChange={() => handleCategoriaChange('deportivo')}
                            >
                                Deportivo
                            </Checkbox>
                        </div>
                    </div>

                    {/* Precio */}
                    <div className="filtro-section">
                        <h2 className="filtro-label">Precio</h2>
                        <Radio.Group
                            value={filtroPrecio}
                            onChange={(e) => setFiltroPrecio(e.target.value)}
                            className="radio-group"
                        >
                            <Radio value="todos">Todos</Radio>
                            <Radio value="gratuitos">Gratuitos</Radio>
                            <Radio value="pago">De Pago</Radio>
                        </Radio.Group>
                    </div>

                    {/* Botones de acción */}
                    <div className="filtro-actions">
                        <Button
                            type="primary"
                            block
                            size="large"
                            onClick={aplicarFiltros}
                        >
                            Aplicar Filtros
                        </Button>
                        <Button
                            block
                            size="large"
                            onClick={limpiarFiltros}
                        >
                            Limpiar
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className="eventos-main">
                <div className="eventos-content">
                    {/* Header */}
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Próximos Eventos</h1>
                            <p className="page-subtitle">Encuentra tu próxima aventura</p>
                        </div>
                    </div>

                    {/* Controles de vista y ordenamiento */}
                    <div className="controles-wrapper">
                        <div className="view-switcher">
                            <Button
                                type={vistaActual === 'lista' ? 'primary' : 'default'}
                                icon={<UnorderedListOutlined />}
                                onClick={() => setVistaActual('lista')}
                            >
                                Lista
                            </Button>
                            <Button
                                type={vistaActual === 'calendario' ? 'primary' : 'default'}
                                icon={<CalendarOutlined />}
                                onClick={() => setVistaActual('calendario')}
                            >
                                Calendario
                            </Button>
                            <Button
                                type={vistaActual === 'mapa' ? 'primary' : 'default'}
                                icon={<EnvironmentFilled />}
                                onClick={() => setVistaActual('mapa')}
                            >
                                Mapa
                            </Button>
                        </div>

                        <Select
                            value={ordenamiento}
                            onChange={setOrdenamiento}
                            style={{ width: 250 }}
                            size="large"
                        >
                            <Option value="fecha">Ordenar por: Fecha</Option>
                            <Option value="popularidad">Ordenar por: Popularidad</Option>
                            <Option value="precio-menor">Ordenar por: Precio (menor)</Option>
                            <Option value="precio-mayor">Ordenar por: Precio (mayor)</Option>
                        </Select>
                    </div>

                    {/* Grid de eventos */}
                    {eventosFiltrados.length === 0 ? (
                        <div className="empty-state">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <div>
                                        <h3>No se encontraron eventos</h3>
                                        <p>No hay eventos que coincidan con tu búsqueda.<br/>
                                            ¡Intenta ajustar tus filtros para descubrir más aventuras!</p>
                                    </div>
                                }
                            />
                        </div>
                    ) : (
                        <div className="eventos-grid">
                            {eventosFiltrados.map((evento) => (
                                <Card
                                    key={evento.id}
                                    hoverable
                                    className="evento-card"
                                    cover={
                                        <div className="evento-image-container">
                                            <img
                                                alt={evento.nombre}
                                                src={
                                                    evento.imagen ||
                                                    evento.fotos?.[0] ||
                                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e0e0e0' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E🎉 Evento%3C/text%3E%3C/svg%3E"
                                                }
                                                className="evento-image"
                                            />
                                            <Button
                                                type="text"
                                                icon={
                                                    favoritos.includes(evento.id)
                                                        ? <HeartFilled style={{ color: '#ff4d4f' }} />
                                                        : <HeartOutlined />
                                                }
                                                className="favorito-btn"
                                                onClick={() => toggleFavorito(evento.id)}
                                            />
                                            {evento.destacado && (
                                                <Tag color="red" className="destacado-tag">
                                                    ¡Últimos lugares!
                                                </Tag>
                                            )}
                                        </div>
                                    }
                                >
                                    <h3 className="evento-nombre">{evento.nombre}</h3>

                                    <div className="evento-info">
                                        <CalendarOutlined />
                                        <span>{formatearFecha(evento.fecha)} - {evento.hora || '00:00'}h</span>
                                    </div>

                                    <div className="evento-info">
                                        <EnvironmentOutlined />
                                        <span>{evento.ubicacion || 'Ubicación por confirmar'}</span>
                                    </div>

                                    <div className="evento-footer">
                                        <span className={`evento-precio ${!evento.precio || evento.precio === 0 ? 'gratis' : ''}`}>
                                            {formatearPrecio(evento.precio)}
                                        </span>
                                        <Button type="primary" ghost>
                                            Ver Detalles
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ListaEventos;