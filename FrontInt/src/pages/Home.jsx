import React from 'react';
import { useNavigate } from 'react-router-dom';
import imagenLogin from '../assets/imagenLogin.jpg';
import imagenHome from '../assets/imagenHome.jpg';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <div style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${imagenLogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        padding: '20px',
        position: 'relative'
      }}>
        {/* Overlay oscuro */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }}></div>

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '800px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '30px'
          }}>
            <svg width="70" height="70" viewBox="0 0 40 40" fill="none">
              <path d="M20 5L15 15L20 20L25 15L20 5Z" fill="#16a085"/>
              <path d="M12 20L8 28L20 35L32 28L28 20L20 25L12 20Z" fill="#16a085"/>
            </svg>
            <div>
              <div style={{
                fontSize: 'clamp(28px, 5vw, 40px)',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: '1.2',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                SIERRA EXPLORA
              </div>
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 56px)',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 20px 0',
            lineHeight: '1.2',
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
          }}>
            Descubre Arroyo Seco
          </h1>

          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: 'white',
            margin: '0 0 50px 0',
            fontStyle: 'italic',
            textShadow: '1px 1px 4px rgba(0,0,0,0.7)'
          }}>
            Vive experiencias únicas en la Sierra Gorra Gorda Queretana
          </p>

          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: '#16a085',
                color: 'white',
                padding: '18px 40px',
                border: 'none',
                borderRadius: '10px',
                fontSize: 'clamp(16px, 2vw, 18px)',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                minWidth: '180px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 6px 20px rgba(22, 160, 133, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
              }}
            >
              Iniciar Sesión
            </button>

            <button
              onClick={() => navigate('/registro')}
              style={{
                backgroundColor: 'white',
                color: '#16a085',
                padding: '18px 40px',
                border: '2px solid white',
                borderRadius: '10px',
                fontSize: 'clamp(16px, 2vw, 18px)',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                minWidth: '180px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#16a085';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
              }}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div style={{
        padding: 'clamp(40px, 8vw, 80px) 20px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 'bold',
            color: '#2c3e50',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            Sobre Arroyo Seco
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            color: '#7f8c8d',
            textAlign: 'center',
            lineHeight: '1.8',
            maxWidth: '800px',
            margin: '0 auto 60px auto'
          }}>
            Arroyo Seco es un pintoresco Pueblo Mágico ubicado en la Sierra Gorda de Querétaro.
            Con su arquitectura colonial, calles empedradas y paisajes naturales impresionantes,
            es el destino perfecto para los amantes de la aventura y la naturaleza.
          </p>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            marginBottom: '60px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '50px', marginBottom: '15px' }}>⛰️</div>
              <h3 style={{
                fontSize: 'clamp(18px, 2.5vw, 22px)',
                color: '#2c3e50',
                marginBottom: '10px',
                fontWeight: '600'
              }}>Tours y Aventuras</h3>
              <p style={{
                fontSize: 'clamp(14px, 2vw, 16px)',
                color: '#7f8c8d',
                lineHeight: '1.6'
              }}>
                Explora cascadas, cañones y senderos naturales con guías expertos
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '50px', marginBottom: '15px' }}>🏠</div>
              <h3 style={{
                fontSize: 'clamp(18px, 2.5vw, 22px)',
                color: '#2c3e50',
                marginBottom: '10px',
                fontWeight: '600'
              }}>Alojamiento</h3>
              <p style={{
                fontSize: 'clamp(14px, 2vw, 16px)',
                color: '#7f8c8d',
                lineHeight: '1.6'
              }}>
                Hospédate en cabañas y hoteles con las mejores vistas de la sierra
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '50px', marginBottom: '15px' }}>🍴</div>
              <h3 style={{
                fontSize: 'clamp(18px, 2.5vw, 22px)',
                color: '#2c3e50',
                marginBottom: '10px',
                fontWeight: '600'
              }}>Gastronomía Local</h3>
              <p style={{
                fontSize: 'clamp(14px, 2vw, 16px)',
                color: '#7f8c8d',
                lineHeight: '1.6'
              }}>
                Disfruta de la auténtica cocina queretana y platillos tradicionales
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '50px', marginBottom: '15px' }}>🏄</div>
              <h3 style={{
                fontSize: 'clamp(18px, 2.5vw, 22px)',
                color: '#2c3e50',
                marginBottom: '10px',
                fontWeight: '600'
              }}>Actividades</h3>
              <p style={{
                fontSize: 'clamp(14px, 2vw, 16px)',
                color: '#7f8c8d',
                lineHeight: '1.6'
              }}>
                Rappel, tirolesa, senderismo y más aventuras extremas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        padding: 'clamp(40px, 8vw, 80px) 20px',
        backgroundColor: '#16a085',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '20px'
        }}>
          ¿Listo para la aventura?
        </h2>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: 'white',
          marginBottom: '40px',
          maxWidth: '700px',
          margin: '0 auto 40px auto'
        }}>
          Regístrate ahora y descubre todas las experiencias que Arroyo Seco tiene para ti
        </p>
        <button
          onClick={() => navigate('/registro')}
          style={{
            backgroundColor: 'white',
            color: '#16a085',
            padding: '18px 50px',
            border: 'none',
            borderRadius: '10px',
            fontSize: 'clamp(16px, 2vw, 18px)',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
          }}
        >
          Crear Cuenta Gratis
        </button>
      </div>

      {/* Footer */}
      <div style={{
        padding: '30px 20px',
        backgroundColor: '#2c3e50',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: 'clamp(14px, 2vw, 16px)',
          color: '#95a5a6',
          margin: '0'
        }}>
          © 2025 Experiencias Arroyo - Sierra Gorra Gorda, Querétaro
        </p>
      </div>
    </div>
  );
}

export default Home;
