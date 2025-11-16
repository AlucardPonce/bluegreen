import React, { useState, useEffect } from 'react';
import { Input, Dropdown } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import { BarChart2, MapPin } from 'lucide-react';
import { obtenerAtracciones } from '../../service/atraccionService';
import './ListaAtacciones.css';

const ListaAtacciones = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [selectedDifficulty, setSelectedDifficulty] = useState('Todas');
    const [atracciones, setAtracciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar atracciones desde la API
    useEffect(() => {
        const fetchAtracciones = async () => {
            try {
                setLoading(true);
                const data = await obtenerAtracciones();
                
                console.log('Atracciones recibidas en lista:', data);
                
                const atraccionesActivas = data.filter(a => 
                    a.estado === 'activo' || a.estado === 'activa'
                );
                
                console.log('Atracciones activas en lista:', atraccionesActivas);
                
                const mappedAtracciones = atraccionesActivas.map(atraccion => ({
                    id: atraccion.id,
                    nombre: atraccion.nombre,
                    categoria: atraccion.categoria || 'Sin categoría',
                    dificultad: atraccion.nivelDificultad || 'No especificada',
                    distancia: atraccion.distancia || 'N/A',
                    // Priorizar imagen Base64, luego imagen por defecto SVG
                    imagen: (atraccion.fotos && atraccion.fotos.length > 0) 
                        ? atraccion.fotos[0] 
                        : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e0e0e0' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E%F0%9F%8F%9E%EF%B8%8F Sin imagen%3C/text%3E%3C/svg%3E",
                    costo: atraccion.costoEntrada || 'Gratuito'
                }));

                console.log('Atracciones mapeadas:', mappedAtracciones);
                setAtracciones(mappedAtracciones);
            } catch (err) {
                console.error('Error al cargar atracciones:', err);
                setError('No se pudieron cargar las atracciones');
            } finally {
                setLoading(false);
            }
        };

        fetchAtracciones();
    }, []);

    // Obtener categorías y dificultades únicas
    const categorias = ['Todas', ...new Set(atracciones.map(a => a.categoria).filter(Boolean))];
    const dificultades = ['Todas', ...new Set(atracciones.map(a => a.dificultad).filter(Boolean))];

    // Configurar items del menú para Dropdown
    const menuCategoriaItems = categorias.map(cat => ({
        key: cat,
        label: cat,
        onClick: () => setSelectedCategory(cat)
    }));

    const menuDificultadItems = dificultades.map(dif => ({
        key: dif,
        label: dif,
        onClick: () => setSelectedDifficulty(dif)
    }));

    const atraccionesFiltradas = atracciones.filter(atraccion => {
        const matchSearch = atraccion.nombre.toLowerCase().includes(searchText.toLowerCase());
        const matchCategory = selectedCategory === 'Todas' || atraccion.categoria === selectedCategory;
        const matchDifficulty = selectedDifficulty === 'Todas' || atraccion.dificultad === selectedDifficulty;
        return matchSearch && matchCategory && matchDifficulty;
    });

    if (loading) {
        return (
            <div className="page-container">
                <main className="main-content">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Cargando atracciones...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <main className="main-content">
                    <div className="error-container">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>
                            Reintentar
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="page-container">
            <main className="main-content">
                <div className="container">
                    {/* Search Bar */}
                    <div className="search-container">
                        <Input
                            size="large"
                            placeholder="Buscar atracciones por nombre..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Filters */}
                    <div className="filters-container">
                        <span className="filter-label">Filtrar por:</span>

                        <Dropdown menu={{ items: menuCategoriaItems }} trigger={['click']}>
                            <button className="filter-button">
                                {selectedCategory}
                                <DownOutlined style={{ fontSize: '12px' }} />
                            </button>
                        </Dropdown>

                        <Dropdown menu={{ items: menuDificultadItems }} trigger={['click']}>
                            <button className="filter-button">
                                {selectedDifficulty}
                                <DownOutlined style={{ fontSize: '12px' }} />
                            </button>
                        </Dropdown>
                    </div>

                    {/* Cards Grid */}
                    <div className="cards-grid">
                        {atraccionesFiltradas.map((atraccion) => (
                            <div key={atraccion.id} className="attraction-card">
                                <div
                                    className="card-image"
                                    style={{ backgroundImage: `url("${atraccion.imagen}")` }}
                                >
                                    <div className="card-overlay" />
                                </div>

                                <div className="card-content">
                                    <h3 className="card-title">{atraccion.nombre}</h3>
                                    <p className="card-category">{atraccion.categoria}</p>

                                    <div className="card-info">
                                        <span className="info-item">
                                            <BarChart2 size={16} />
                                            {atraccion.dificultad}
                                        </span>
                                        <span className="info-item">
                                            <MapPin size={16} />
                                            {atraccion.costo}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {atraccionesFiltradas.length === 0 && (
                        <div className="no-results">
                            <p>No se encontraron atracciones con los filtros seleccionados</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ListaAtacciones;