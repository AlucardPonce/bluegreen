import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRestaurant } from '../../service/restaurantService';
import { getDishesByRestaurant } from '../../service/dishService';
import imagenHome from '../../assets/imagenHome.jpg';

function InfoRestaurante() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener información del restaurante directamente por ID
        const restaurantResp = await getRestaurant(id);
        console.log('Restaurante obtenido:', restaurantResp);
        
        // La respuesta viene en restaurantResp.data
        if (!restaurantResp.data) {
          setError('notfound');
          return;
        }
        
        setRestaurant(restaurantResp.data);

        // Obtener platillos del restaurante
        try {
          const dishesResp = await getDishesByRestaurant(id);
          console.log('Platillos obtenidos:', dishesResp);
          
          // getDishesByRestaurant ya devuelve resp.data, así que dishesResp.data es el array
          setDishes(dishesResp.data || []);
        } catch (dishError) {
          console.log('No se pudieron cargar los platillos:', dishError);
          setDishes([]);
        }

      } catch (error) {
        console.error('Error al cargar información del restaurante:', error);
        
        // Si el restaurante no existe, el servidor devuelve 404
        if (error.response?.status === 404) {
          setError('notfound');
        } else {
          setError('general');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantInfo();
  }, [id]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${imagenHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          textAlign: 'center',
          color: '#7f8c8d',
          fontSize: '18px'
        }}>
          Cargando información del restaurante...
        </div>
      </div>
    );
  }

  if (error === 'notfound') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${imagenHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🍽️</div>
          <h2 style={{ color: '#e74c3c', marginBottom: '16px' }}>Restaurante no encontrado</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '24px' }}>
            El restaurante que buscas no existe o ha sido eliminado.
          </p>
          <button
            onClick={() => navigate('/experiencia/restaurante')}
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
            Volver a Restaurantes
          </button>
        </div>
      </div>
    );
  }

  if (error === 'general') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${imagenHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#e74c3c', marginBottom: '16px' }}>Error al cargar</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '24px' }}>
            Hubo un problema al cargar la información del restaurante.
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
            onClick={() => navigate('/experiencia/restaurante')}
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
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundImage: `url(${imagenHome})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        borderRadius: '15px',
        maxWidth: '1000px',
        width: '100%',
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        {/* Botón de volver */}
        <div style={{
          padding: '20px 30px',
          borderBottom: '1px solid #ecf0f1'
        }}>
          <button
            onClick={() => navigate('/experiencia/restaurante')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#16a085',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ecf0f1';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            ← Volver a Restaurantes
          </button>
        </div>

        {/* Imagen principal del restaurante */}
        {restaurant.image && (
          <div style={{
            width: '100%',
            height: '400px',
            overflow: 'hidden'
          }}>
            <img
              src={restaurant.image}
              alt={restaurant.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        )}

        {/* Información del restaurante */}
        <div style={{ padding: '40px' }}>
          <h1 style={{
            fontSize: '36px',
            color: '#2c3e50',
            marginBottom: '20px',
            fontWeight: '700'
          }}>
            {restaurant.name}
          </h1>

          {/* Horario */}
          {restaurant.schedule && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#ecf0f1',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '24px' }}>🕒</span>
              <div>
                <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '4px' }}>Horario</div>
                <div style={{ fontSize: '16px', color: '#2c3e50', fontWeight: '600' }}>
                  {restaurant.schedule}
                </div>
              </div>
            </div>
          )}

          {/* Ubicación */}
          {(restaurant.latitude && restaurant.longitude) && (
            <div style={{
              marginBottom: '30px',
              padding: '15px',
              backgroundColor: '#e8f8f5',
              borderRadius: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '24px' }}>📍</span>
                <div style={{ fontSize: '16px', color: '#2c3e50', fontWeight: '600' }}>
                  Ubicación
                </div>
              </div>
              <a
                href={`https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#16a085',
                  fontSize: '15px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Ver en Google Maps →
              </a>
            </div>
          )}

          {/* Descripción (si existe) */}
          {restaurant.description && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '24px',
                color: '#2c3e50',
                marginBottom: '16px',
                fontWeight: '600'
              }}>
                Acerca de
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#34495e',
                lineHeight: '1.8'
              }}>
                {restaurant.description}
              </p>
            </div>
          )}

          {/* Menú / Platillos */}
          <div>
            <h2 style={{
              fontSize: '24px',
              color: '#2c3e50',
              marginBottom: '20px',
              fontWeight: '600'
            }}>
              Nuestro Menú
            </h2>

            {dishes.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#ecf0f1',
                borderRadius: '12px',
                color: '#7f8c8d'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍽️</div>
                <p style={{ fontSize: '16px' }}>
                  El menú estará disponible próximamente
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {dishes.map((dish) => (
                  <div
                    key={dish.id}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #ecf0f1',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {dish.image && (
                      <img
                        src={dish.image}
                        alt={dish.name}
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          marginBottom: '15px'
                        }}
                      />
                    )}
                    <h3 style={{
                      fontSize: '18px',
                      color: '#2c3e50',
                      marginBottom: '8px',
                      fontWeight: '600'
                    }}>
                      {dish.name}
                    </h3>
                    {dish.description && (
                      <p style={{
                        fontSize: '14px',
                        color: '#7f8c8d',
                        lineHeight: '1.5',
                        marginBottom: '12px'
                      }}>
                        {dish.description}
                      </p>
                    )}
                    {dish.price && (
                      <div style={{
                        fontSize: '20px',
                        color: '#16a085',
                        fontWeight: '700'
                      }}>
                        ${dish.price}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer con redes sociales */}
        <div style={{
          backgroundColor: '#ecf0f1',
          padding: '30px',
          textAlign: 'center',
          borderTop: '1px solid #bdc3c7'
        }}>
          <div style={{
            fontSize: '16px',
            color: '#7f8c8d',
            marginBottom: '15px',
            fontWeight: '500'
          }}>
            Síguenos en nuestras redes sociales
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px'
          }}>
            <div style={{
              fontSize: '32px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >📷</div>
            <div style={{
              fontSize: '32px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >📘</div>
            <div style={{
              fontSize: '32px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >🐦</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoRestaurante;
