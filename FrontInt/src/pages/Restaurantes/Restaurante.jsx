import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import imagenHome from '../../assets/imagenHome.jpg';
import { logout, getCurrentUser } from '../../utils/auth';
import { listRestaurants } from '../../service/restaurantService';

function Restaurante() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = getCurrentUser();
  const menuRef = useRef(null);

  // Cargar restaurantes
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Verificar si hay token antes de hacer la petición
        const token = localStorage.getItem('token');
        console.log('Token disponible:', !!token);
        console.log('Usuario actual:', user);
        
        const resp = await listRestaurants();
        console.log('Respuesta del servidor:', resp);
        
        // Los datos vienen en resp.data según el componente de admin
        setRestaurants(resp.data || []);
      } catch (error) {
        console.error('Error completo al cargar restaurantes:', error);
        console.error('Status del error:', error.response?.status);
        console.error('Datos del error:', error.response?.data);
        
        // Verificar si es un error 403 (no autorizado)
        if (error.response?.status === 403) {
          console.error('Error 403: No tienes permisos para ver restaurantes');
          setError('forbidden');
        } else if (error.response?.status === 401) {
          console.error('Error 401: No estás autenticado o el token expiró');
          setError('auth');
        } else if (error.code === 'ERR_NETWORK') {
          console.error('Error de red: No se puede conectar al servidor');
          setError('network');
        } else {
          setError('general');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: `url(${imagenHome})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Hero Section */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        minHeight: '100vh',
        overflow: 'auto'
      }}>
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          padding: '30px 40px',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '30px',
          width: '90%',
          maxWidth: '900px'
        }}>
          <h1 style={{
            color: 'white',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontStyle: 'italic',
            margin: '0',
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
            fontWeight: '600'
          }}>
            Descubre de la<br/>
            Sierra Gorra Gorda Queretana
          </h1>
        </div>

        {/* Action Buttons */}
        {/*<div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '40px',
          width: '90%',
          maxWidth: '900px',
          padding: '0 10px'
        }}>
          <button style={{
            backgroundColor: '#16a085',
            color: 'white',
            padding: '14px 32px',
            border: 'none',
            borderRadius: '8px',
            fontSize: 'clamp(14px, 2vw, 16px)',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            flex: '1 1 auto',
            minWidth: '140px'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Ver Tours
          </button>
          <button style={{
            backgroundColor: '#e67e22',
            color: 'white',
            padding: '14px 32px',
            border: 'none',
            borderRadius: '8px',
            fontSize: 'clamp(14px, 2vw, 16px)',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            flex: '1 1 auto',
            minWidth: '180px'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Reservar Alojamento
          </button>
          <button style={{
            backgroundColor: '#95a5a6',
            color: 'white',
            padding: '14px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: 'clamp(14px, 2vw, 16px)',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            flex: '1 1 auto',
            minWidth: '200px',
            justifyContent: 'center'
          }}
          onClick={() => navigate('/experiencia/mapa')}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            📍 Mapa de Atracciones
          </button>
        </div>*/}

        {/* Categories Section */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: 'clamp(20px, 4vw, 40px)',
          borderRadius: '15px',
          width: '90%',
          maxWidth: '900px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#2c3e50',
            marginBottom: '30px',
            fontWeight: '600'
          }}>
            Explora por Los diferentes restaurantes
          </h2>
          
          {/* Restaurants List */}
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#7f8c8d',
              fontSize: '18px'
            }}>
              Cargando restaurantes...
            </div>
          ) : error === 'forbidden' ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#e67e22',
              fontSize: '16px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>�</div>
              <div style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px' }}>
                Acceso no permitido
              </div>
              <p style={{ color: '#7f8c8d', marginBottom: '8px' }}>
                Tu cuenta no tiene permisos para ver esta información.
              </p>
              <p style={{ color: '#95a5a6', fontSize: '14px', marginBottom: '20px' }}>
                Usuario: {user?.email || 'No identificado'}<br/>
                Rol: {user?.role || 'No definido'}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#16a085',
                  color: 'white',
                  padding: '12px 32px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                  marginRight: '10px'
                }}
              >
                Reintentar
              </button>
              <button
                onClick={() => navigate('/experiencia')}
                style={{
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  padding: '12px 32px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
              >
                Volver al inicio
              </button>
            </div>
          ) : error === 'auth' ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#e67e22',
              fontSize: '16px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
              <div style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px' }}>
                Sesión expirada o inválida
              </div>
              <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                Tu sesión ha expirado. Por favor inicia sesión nuevamente.
              </p>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                style={{
                  backgroundColor: '#16a085',
                  color: 'white',
                  padding: '12px 32px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          ) : error === 'network' ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#e74c3c',
              fontSize: '16px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌐</div>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                Error de conexión
              </div>
              <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                No se puede conectar al servidor. Verifica tu conexión a internet.
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#16a085',
                  color: 'white',
                  padding: '12px 32px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
              >
                Reintentar
              </button>
            </div>
          ) : error === 'general' ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#e74c3c',
              fontSize: '16px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                Error al cargar los restaurantes
              </div>
              <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                Por favor, intenta nuevamente más tarde
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#16a085',
                  color: 'white',
                  padding: '12px 32px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
              >
                Reintentar
              </button>
            </div>
          ) : restaurants.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#7f8c8d',
              fontSize: '16px'
            }}>
              No hay restaurantes disponibles
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                    e.currentTarget.style.borderColor = '#16a085';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  {restaurant.image && (
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}
                    />
                  )}
                  <h3 style={{
                    fontSize: '18px',
                    color: '#2c3e50',
                    marginBottom: '10px',
                    fontWeight: '600'
                  }}>
                    {restaurant.name}
                  </h3>
                  {restaurant.schedule && (
                    <p style={{
                      fontSize: '14px',
                      color: '#7f8c8d',
                      marginBottom: '12px',
                      lineHeight: '1.5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      🕒 {restaurant.schedule}
                    </p>
                  )}
                  {(restaurant.latitude && restaurant.longitude) && (
                    <a
                      href={`https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '13px',
                        color: '#16a085',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                      � Ver en el mapa
                    </a>
                  )}
                  <div style={{ fontSize: '14px', color: '#34495e', lineHeight: '1.6' }}>
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/experiencia/restaurante/${restaurant.id}`);
                      }}
                      style={{ 
                        color: '#16a085', 
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#138d75'}
                      onMouseLeave={(e) => e.target.style.color = '#16a085'}
                    >
                      Ver más información →
                    </a>
                  </div>
                </div>
                
              ))}
            </div>
          )}

          {/* Social Icons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '25px',
            marginTop: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              fontSize: 'clamp(28px, 4vw, 35px)',
              color: '#e4405f',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >📷</div>
            <div style={{
              fontSize: 'clamp(28px, 4vw, 35px)',
              color: '#3b5998',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >📘</div>
            <div style={{
              fontSize: 'clamp(28px, 4vw, 35px)',
              color: '#1da1f2',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >🐦</div>
          </div>

          {/* Contact */}
          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            color: '#7f8c8d',
            fontSize: 'clamp(13px, 2vw, 15px)',
            fontWeight: '500'
          }}>
            Contacto Rápido
          </div>
        </div>
      </div>
    </div>
  );
}

export default Restaurante;