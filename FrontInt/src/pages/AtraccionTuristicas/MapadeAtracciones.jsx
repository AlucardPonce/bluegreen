import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { obtenerAtracciones } from '../../service/atraccionService';
import './MapadeAtracciones.css';

// Fix para iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Crear iconos personalizados
const createCustomIcon = (emoji, color) => {
    return L.divIcon({
        className: 'custom-leaflet-icon',
        html: `<div style="background: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 20px;">${emoji}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

const MapadeAtracciones = () => {
    const [showQuestCard, setShowQuestCard] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [viewMode, setViewMode] = useState('map');
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Coordenadas de Arroyo Seco, Querétaro
    const arroyoSecoCenter = [21.5523, -99.6739];

    // Cargar atracciones desde la API
    useEffect(() => {
        const fetchAtracciones = async () => {
            try {
                setLoading(true);
                const data = await obtenerAtracciones();
                
                console.log('Atracciones recibidas:', data);
                
                const atraccionesActivas = data.filter(atraccion => 
                    atraccion.estado === 'activo' || atraccion.estado === 'activa'
                );
                
                console.log('Atracciones activas:', atraccionesActivas);
                
                const mappedLocations = atraccionesActivas.map(atraccion => ({
                    id: atraccion.id,
                    name: atraccion.nombre,
                    icon: getIconByType(atraccion.categoria),
                    coordinates: [
                        parseFloat(atraccion.latitud) || arroyoSecoCenter[0],
                        parseFloat(atraccion.longitud) || arroyoSecoCenter[1]
                    ],
                    type: atraccion.categoria,
                    color: getColorByType(atraccion.categoria),
                    description: atraccion.descripcion || 'Sin descripción disponible',
                    horario: atraccion.horarios || "Consultar horario",
                    // Priorizar imagen Base64, luego URL, finalmente imagen por defecto
                    imagen: (atraccion.fotos && atraccion.fotos.length > 0) 
                        ? atraccion.fotos[0] 
                        : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ESin imagen%3C/text%3E%3C/svg%3E",
                    audioUrl: atraccion.audioUrl || null,
                    videoUrl: atraccion.videoUrl || null,
                    costo: atraccion.costoEntrada || 'Gratuito',
                    servicios: atraccion.servicios || '',
                    restricciones: atraccion.restricciones || '',
                    informacionCultural: atraccion.informacionCultural || ''
                }));

                console.log('Locations mapeadas:', mappedLocations);
                setLocations(mappedLocations);
            } catch (err) {
                console.error('Error al cargar atracciones:', err);
                setError('No se pudieron cargar las atracciones');
            } finally {
                setLoading(false);
            }
        };

        fetchAtracciones();
    }, []);

    // Función para obtener icono según tipo
    const getIconByType = (tipo) => {
        const iconos = {
            'naturaleza': '🌊',
            'historico': '🏛️',
            'aventura': '🕳️',
            'restaurante': '🍽️',
            'mirador': '🔭',
            'balneario': '🏖️',
            'cascada': '💧',
            'senderismo': '🥾',
            'pueblo': '🏘️'
        };
        return iconos[tipo?.toLowerCase()] || '📍';
    };

    // Función para obtener color según tipo
    const getColorByType = (tipo) => {
        const colores = {
            'naturaleza': '#3b82f6',
            'historico': '#ef4444',
            'aventura': '#8b5cf6',
            'restaurante': '#f59e0b',
            'mirador': '#10b981',
            'balneario': '#06b6d4',
            'cascada': '#3b82f6',
            'senderismo': '#16a34a',
            'pueblo': '#dc2626'
        };
        return colores[tipo?.toLowerCase()] || '#6b7280';
    };

    const stories = [
        {
            id: 1,
            author: "Martín García",
            role: "Guía Local",
            roleIcon: "🚕",
            emoji: "☀️🏖️",
            avatar: "https://via.placeholder.com/40",
            badge: { text: "Guía Local", color: "#17cf17" },
            content: "¡Qué día tan increíble! Las aguas cristalinas de El Sauce son perfectas para escapar del calor. Descubrimos un pequeño sendero escondido que llevaba a una cascada secreta. ¡Una verdadera joya!"
        },
        {
            id: 2,
            author: "Sofía Torres",
            role: "Visitante Verificado",
            roleIcon: "✓",
            emoji: "🛶",
            avatar: "https://via.placeholder.com/40",
            badge: { text: "Visitante Verificado", color: "#3b82f6" },
            content: "Alquilamos una canoa y remamos río arriba. La tranquilidad del lugar es mágica. Vimos varias aves exóticas. Ideal para un picnic familiar junto al río."
        },
        {
            id: 3,
            author: "Juan Pérez",
            role: "Explorador",
            roleIcon: "👤",
            emoji: "🥾",
            avatar: "https://via.placeholder.com/40",
            badge: { text: "Explorador", color: "#6b7280" },
            content: "Los senderos están muy bien señalizados. Hice una caminata por la mañana y el aire puro es revitalizante. ¡No olvides tu cámara para las vistas panorámicas!"
        }
    ];

    const handleMarkerClick = (location) => {
        setSelectedLocation(location);
    };

    if (loading) {
        return (
            <div className="mapa-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando atracciones...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mapa-page">
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mapa-page">
            <div className="mapa-main-content">
                {/* Mapa Principal con Leaflet */}
                <main className="mapa-main">
                    <div className="mapa-leaflet-container">
                        <MapContainer
                            center={arroyoSecoCenter}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            
                            {locations.map((location) => (
                                <Marker
                                    key={location.id}
                                    position={location.coordinates}
                                    icon={createCustomIcon(location.icon, location.color)}
                                    eventHandlers={{
                                        click: () => handleMarkerClick(location)
                                    }}
                                >
                                    <Popup>
                                        <div className="custom-popup">
                                            <h3>{location.name}</h3>
                                            <p>{location.description}</p>
                                            <p className="popup-horario">⏰ {location.horario}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        {/* Búsqueda superpuesta */}
                        <div className="search-overlay">
                            <div className="search-main-container">
                                <span className="search-icon-main">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar lugares o actividades"
                                    className="search-input-main"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Tarjeta de Desafío */}
                        {showQuestCard && (
                            <div className="quest-card">
                                <h2 className="quest-title">¡Descubre el Balneario El Sauce!</h2>
                                <p className="quest-description">
                                    Un chapuzón en la historia te espera. Este lugar esconde secretos que solo los más curiosos pueden desvelar. ¿Estás listo para el desafío?
                                </p>
                                <div className="quest-actions">
                                    <button className="btn-quest-primary">
                                        <span className="btn-icon">💡</span>
                                        <span>Resuelve un Acertijo para Revelar su Historia</span>
                                    </button>
                                    <button className="btn-quest-secondary">
                                        <span className="btn-icon">💎</span>
                                        <span>Encuentra el Tesoro Oculto</span>
                                    </button>
                                    <button
                                        className="btn-close-quest"
                                        onClick={() => setShowQuestCard(false)}
                                    >
                                        Cerrar Desafío
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Controles de Zoom personalizados */}
                        <div className="map-controls">
                            <div className="zoom-controls">
                                <button className="zoom-btn" aria-label="Zoom in">➕</button>
                                <div className="zoom-divider"></div>
                                <button className="zoom-btn" aria-label="Zoom out">➖</button>
                            </div>
                            <button 
                                className="navigation-btn" 
                                aria-label="Mi ubicación"
                                onClick={() => setShowQuestCard(!showQuestCard)}
                            >
                                🧭
                            </button>
                        </div>

                        {/* Botones de Acción Flotantes */}
                        <div className="floating-actions">
                            <button className="btn-floating-primary">
                                <span className="btn-icon">🧭</span>
                                <span>Explorar Mapa</span>
                            </button>
                            <button
                                className="btn-floating-secondary"
                                onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                            >
                                <span className="btn-icon">📋</span>
                                <span>Ver Lista</span>
                            </button>
                        </div>
                    </div>
                </main>

                {/* Sidebar */}
                <aside className="mapa-sidebar">
                    <div className="sidebar-content">
                        <h1 className="sidebar-title">
                            {selectedLocation ? selectedLocation.name : 'Arroyo Seco'}
                        </h1>

                        {/* Imagen Principal */}
                        <div className="location-image-container">
                            <div 
                                className="location-image"
                                style={{
                                    backgroundImage: `url(${selectedLocation?.imagen || 'https://via.placeholder.com/400'})`
                                }}
                            ></div>
                        </div>

                        {/* Descripción */}
                        <p className="location-description">
                            {selectedLocation 
                                ? selectedLocation.description 
                                : 'Selecciona una atracción en el mapa para ver más detalles.'}
                        </p>

                        {/* Horarios */}
                        <div className="location-schedule">
                            <h3 className="section-title">Horarios</h3>
                            <div className="schedule-item">
                                <span className="schedule-icon">⏰</span>
                                <span>
                                    {selectedLocation 
                                        ? selectedLocation.horario 
                                        : 'Abierto de 9:00 a 20:00 todos los días'}
                                </span>
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="location-actions">
                            <button className="btn-action-primary">
                                <span className="btn-icon">🧭</span>
                                <span>Cómo llegar</span>
                            </button>
                            <button className="btn-action-secondary">
                                <span className="btn-icon">❤️</span>
                                <span>Favoritos</span>
                            </button>
                        </div>

                        {/* Historias de Visitantes */}
                        <div className="stories-section">
                            <h3 className="section-title">Historias de Visitantes</h3>
                            <div className="stories-list">
                                {stories.map((story) => (
                                    <div key={story.id} className="story-card">
                                        <div className="story-header">
                                            <div className="story-avatar">
                                                <img src={story.avatar} alt={story.author} />
                                            </div>
                                            <div className="story-author-info">
                                                <p className="story-author">{story.author}</p>
                                                <div className="story-badge" style={{ color: story.badge.color }}>
                                                    <span className="badge-icon">{story.roleIcon}</span>
                                                    <span>{story.badge.text}</span>
                                                </div>
                                            </div>
                                            <span className="story-emoji">{story.emoji}</span>
                                        </div>
                                        <p className="story-content">{story.content}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="btn-add-story">
                                <span className="btn-icon">💬</span>
                                Añadir tu propia historia
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default MapadeAtracciones;